/**
 * Allura Governance Plugin
 *
 * Enforces the P0/P1/P2 policies from .opencode/policy/ as runtime hooks.
 * Source of truth: AGENTS.md and .opencode/policy/*.md
 *
 * Hooks implemented:
 *   P0  enforce-group-id          — block memory ops without valid group_id
 *   P0  block-db-exec              — block docker exec / direct DB client calls
 *   P0  append-only-guard          — block UPDATE/DELETE on trace/event tables
 *   P0  neo4j-no-mutate-insight    — block SET/DELETE on :Insight nodes
 *   P0  flag-roninclaw-namespace  — warn on roninclaw-* drift
 *   P2  verification-before-done   — log completion claims, flag missing evidence
 *
 * Event model: OpenCode emits `message.part.updated` events. Tool calls surface
 * as Part objects with `type: "tool"` and a `state` that includes `input` (args)
 * and `output` (result). We audit those parts.
 *
 * Load order: global config → project config → global plugins → project plugins.
 * This file is a project plugin, loaded from .opencode/plugins/.
 */

import type { Plugin, Hooks } from "@opencode-ai/plugin"

// ---------------------------------------------------------------------------
// Policy constants — must match .opencode/policy/*.md
// ---------------------------------------------------------------------------

const GROUP_ID_PATTERN = /^allura-[a-z0-9-]+$/
const DEFAULT_GROUP_ID = "allura-system"

const DRIFT_NAMESPACE = "roninclaw"

// Tables that are append-only (layer 1 raw trace store).
const APPEND_ONLY_TABLES = [
  /_events$/i,
  /_traces$/i,
  /_audit$/i,
  /audit_log/i,
  /agent_action_log/i,
  /audit_event/i,
  /audit_receipt/i,
]

// Cypher node labels that are immutable (layer 3 versioned knowledge).
const IMMUTABLE_LABELS = ["Insight", "ApprovedInsight", "CanonicalInsight"]

// Commands that bypass the API layer and hit the DB directly.
const DB_EXEC_PATTERNS = [
  /docker\s+exec\s+\S*(postgres|pg|neo4j)/i,
  /\bpsql\b/i,
  /\bcypher-shell\b/i,
  /bolt:\/\/localhost:7687/i,
  /localhost:\s*5432/i, // postgres port
  /localhost:\s*7687/i, // neo4j bolt port
]

// SQL keywords that mutate rows.
const SQL_MUTATIONS = /\b(UPDATE|DELETE|TRUNCATE)\b/i

// Cypher keywords that mutate nodes.
const CYPHER_MUTATIONS = /\b(SET|DELETE|DETACH\s+DELETE)\b/i

// Hard-block mode: when ALLURA_GOVERNANCE_HARD_BLOCK=1, P0 violations throw
// a GovernanceError to abort the tool call. Otherwise they log loudly.
// Default: advisory (log only). Enable once detection patterns are proven.
const HARD_BLOCK = process.env.ALLURA_GOVERNANCE_HARD_BLOCK === "1"

// Phrases agents use when claiming completion without evidence.
const COMPLETION_CLAIMS = [
  /\bdone\b/i,
  /\bfixed\b/i,
  /\bpassing\b/i,
  /\bshipped\b/i,
  /\bcomplete(?:d)?\b/i,
  /\bverified\b/i,
  /\bworking\b/i,
  /\bsuccessful(?:ly)?\b/i,
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type Severity = "P0" | "P1" | "P2"

class GovernanceError extends Error {
  constructor(public hook: string, detail: string) {
    super(`[allura-governance] 🛓 BLOCK ${hook}: ${detail}`)
    this.name = "GovernanceError"
  }
}

function logPolicyViolation(severity: Severity, hook: string, detail: string) {
  const prefix = severity === "P0" ? "🛓 BLOCK" : severity === "P1" ? "⚠️  WARN" : "📋 LOG"
  console.error(`[allura-governance] ${prefix} ${hook}: ${detail}`)
  // Hard-block: P0 violations abort the tool call by throwing.
  if (severity === "P0" && HARD_BLOCK) {
    throw new GovernanceError(hook, detail)
  }
}

function extractText(input: unknown): string {
  if (!input) return ""
  if (typeof input === "string") return input
  if (typeof input === "object") {
    try { return JSON.stringify(input) } catch { return "" }
  }
  return ""
}

function findGroupId(args: Record<string, unknown> | undefined): string | undefined {
  if (!args) return undefined
  const candidates = ["group_id", "groupId", "groupID", "tenant", "tenant_id"]
  for (const k of candidates) {
    const v = args[k]
    if (typeof v === "string") return v
  }
  if (typeof args.params === "object" && args.params) {
    return findGroupId(args.params as Record<string, unknown>)
  }
  return undefined
}

function isMemoryCall(toolName: string): boolean {
  return /memory_(add|search|get|promote|propose|approve|store|write|query|delete|update)/i.test(toolName)
}

function isSqlCall(toolName: string): boolean {
  return /postgres|sql|db_*(query|exec|run)/i.test(toolName)
}

function isCypherCall(toolName: string): boolean {
  return /neo4j|cypher/i.test(toolName)
}

function isBashCall(toolName: string): boolean {
  return /^(bash|shell|exec|cmd|run_command|terminal)$/i.test(toolName)
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  return s.slice(0, n) + "..."
}

// ---------------------------------------------------------------------------
// Tool part auditing
// ---------------------------------------------------------------------------

interface ToolPartLike {
  type: string
  tool?: string
  state?: {
    status: string
    input?: Record<string, unknown>
    output?: string
  }
}

function auditToolPart(part: ToolPartLike) {
  if (part.type !== "tool") return
  const toolName = part.tool ?? ""
  const input = part.state?.input ?? {}
  const argText = extractText(input)

  // P0: enforce-group-id on memory ops
  if (isMemoryCall(toolName)) {
    const gid = findGroupId(input)
    if (!gid) {
      logPolicyViolation("P0", "enforce-group-id",
        `memory op '${toolName}' missing group_id. Set group_id: "${DEFAULT_GROUP_ID}".`)
    } else if (!GROUP_ID_PATTERN.test(gid)) {
      logPolicyViolation("P0", "enforce-group-id",
        `memory op '${toolName}' has invalid group_id '${gid}'. Must match ${GROUP_ID_PATTERN}.`)
      if (gid.toLowerCase().includes(DRIFT_NAMESPACE)) {
        logPolicyViolation("P0", "flag-roninclaw-namespace",
          `group_id '${gid}' is roninclaw-* drift. Migrate to allura-*.`)
      }
    }
  }

  // P0: flag-roninclaw-namespace across all tool calls
  if (new RegExp(DRIFT_NAMESPACE, "i").test(argText)) {
    logPolicyViolation("P0", "flag-roninclaw-namespace",
      `tool '${toolName}' args contain '${DRIFT_NAMESPACE}-*' drift: ${truncate(argText, 200)}`)
  }

  // P0: block-db-exec — bash/docker/sql/cypher tools
  if (isBashCall(toolName) || isSqlCall(toolName) || isCypherCall(toolName)) {
    for (const pattern of DB_EXEC_PATTERNS) {
      if (pattern.test(argText)) {
        logPolicyViolation("P0", "block-db-exec",
          `tool '${toolName}' appears to bypass API layer (direct DB access): ${truncate(argText, 200)}`)
        break
      }
    }

    // P0: append-only-guard — SQL mutations on protected tables
    if (SQL_MUTATIONS.test(argText)) {
      for (const tablePattern of APPEND_ONLY_TABLES) {
        if (tablePattern.test(argText)) {
          logPolicyViolation("P0", "append-only-guard",
            `SQL mutation on append-only table detected: ${truncate(argText, 200)}`)
          break
        }
      }
    }

    // P0: neo4j-no-mutate-insight — Cypher mutations on :Insight
    if (CYPHER_MUTATIONS.test(argText)) {
      for (const label of IMMUTABLE_LABELS) {
        if (new RegExp(`:${label}\\b`, "i").test(argText)) {
          logPolicyViolation("P0", "neo4j-no-mutate-insight",
            `Cypher mutation on immutable :${label} node: ${truncate(argText, 200)}`)
          break
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Completion claim auditing (P2 — evidence-before-claims)
// ---------------------------------------------------------------------------

function auditTextCompletionClaim(text: string) {
  if (!text) return
  for (const claim of COMPLETION_CLAIMS) {
    if (claim.test(text)) {
      const idx = text.search(claim)
      const snippet = text.slice(idx, idx + 80)
      logPolicyViolation("P2", "verification-before-done",
        `completion claim detected: "${truncate(snippet, 80)}..." — ensure verification output precedes this claim.`)
      break
    }
  }
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export const AlluraGovernance: Plugin = async () => {
  const hooks: Hooks = {}

  // Audit tool calls via the event stream. OpenCode emits message.part.updated
  // events as tool parts change state (pending → running → completed/error).
  hooks.event = async ({ event }) => {
    try {
      // Only handle message part updates
      if (event.type !== "message.part.updated") return

      const part = (event.properties as { part?: ToolPartLike })?.part
      if (!part) return

      // Audit tool parts — we check both running (has input, pre-execution)
      // and completed (has input + output, post-execution) states.
      if (part.type === "tool") {
        auditToolPart(part)
      }
    } catch (err) {
      // Never break the session on a hook bug — log and continue.
      console.error("[allura-governance] event hook error:", err)
    }
  }

  // Audit assistant messages for completion claims without evidence.
  hooks["chat.message"] = async (_input, output) => {
    try {
      const parts = output.parts as Array<{ type: string; text?: string }>
      for (const part of parts) {
        if (part.type === "text" && part.text) {
          auditTextCompletionClaim(part.text)
        }
      }
    } catch (err) {
      console.error("[allura-governance] chat.message hook error:", err)
    }
  }

  return hooks
}

export default AlluraGovernance