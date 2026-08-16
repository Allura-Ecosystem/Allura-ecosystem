# Allura Governance Framework

> Enterprise policy hooks, runtime interception, and governance patterns for agentic AI systems.
> This document frames the Allura ecosystem's governance layer as a reusable framework pattern
> for regulated environments.

## Design principle

**Logs are not knowledge. Agents do not self-promote. Every mutation carries proof.**

The governance framework enforces a separation between raw agent activity (evidence) and
canonical knowledge (truth). Policy hooks intercept every tool call, validate intent, and
block violations before they reach the database.

## Policy architecture

```
┌──────────────────────────────────────────────────────┐
│              Agent Tool Call                          │
├──────────────────────────────────────────────────────┤
│  P0 Hooks (block on violation)                        │
│  enforce-group-id · block-db-exec ·                   │
│  append-only-guard · no-mutate-insight ·              │
│  flag-roninclaw-namespace                             │
├──────────────────────────────────────────────────────┤
│  P1 Gates (warn + require confirmation)               │
│  hitl-promotion-gate · ruvector-boundary              │
├──────────────────────────────────────────────────────┤
│  P2 Disciplinary (warn + log)                         │
│  logs-not-knowledge · evidence-before-claims          │
├──────────────────────────────────────────────────────┤
│  Kernel (cryptographic proof-of-intent)               │
│  gate.ts · proof.ts · syscalls.ts                     │
├──────────────────────────────────────────────────────┤
│  PostgreSQL (append-only + versioned graph)           │
└──────────────────────────────────────────────────────┘
```

## P0 — Non-negotiable policies (block on violation)

| Policy | Hook | What it blocks |
|--------|------|----------------|
| `group_id-required` | `enforce-group-id` | Memory operations without valid `group_id` matching `^allura-[a-z0-9-]+$` |
| `append-only-traces` | `append-only-guard` | `UPDATE`, `DELETE`, `TRUNCATE` on event/trace/audit tables |
| `supersedes-versioning` | `no-mutate-insight` | Direct mutation of canonical knowledge nodes — must use SUPERSEDES |
| `mcp-only-db-access` | `block-db-exec` | `docker exec` into DB containers, direct `psql`/`cypher-shell`, direct port access |
| `allura-namespace-only` | `flag-roninclaw-namespace` | Any `roninclaw-*` namespace usage — flagged as drift |

Files: `.opencode/policy/{group_id-required,append-only-traces,supersedes-versioning,mcp-only-db-access,allura-namespace-only}.md`

## P1 — Governance gates (warn + require confirmation)

| Policy | What it enforces |
|--------|------------------|
| `hitl-promotion-gate` | Curator proposes; only human-in-the-loop promotes. Agents cannot self-promote their own output to canonical knowledge. |
| `ruvector-boundary` | RuVector executes (vector storage, retrieval, routing); Allura governs (tenancy, approval, promotion, versioning). Neither side reaches across. |

Files: `.opencode/policy/{hitl-promotion-gate,ruvector-boundary}.md`

## P2 — Disciplinary policies (warn + log)

| Policy | What it enforces |
|--------|------------------|
| `logs-not-knowledge` | Raw traces never become canonical knowledge without curator pipeline + approval. Prevents "I wrote the finding directly to the graph" shortcuts. |
| `evidence-before-claims` | No "done", "fixed", "passing", "verified", "working", "shipped" claims without verification output. |

Files: `.opencode/policy/{logs-not-knowledge,evidence-before-claims}.md`

## Enforcement plugin

`.opencode/plugins/allura-governance.ts` — runtime enforcement plugin that:

1. Intercepts tool calls via OpenCode plugin hooks (`message.part.updated` events)
2. Pattern-matches tool inputs against policy rules
3. Blocks P0 violations (throws `GovernanceError` in hard-block mode, logs in advisory mode)
4. Warns on P1 violations with confirmation requirement
5. Logs P2 violations for audit review
6. `ALLURA_GOVERNANCE_HARD_BLOCK=1` env var switches from advisory to blocking mode

Key interception patterns:
- `docker exec` targeting postgres/pg containers → blocked
- Direct `psql` / `cypher-shell` invocations → blocked
- SQL `UPDATE`/`DELETE`/`TRUNCATE` on append-only tables → blocked
- Missing `group_id` on memory operations → blocked
- `roninclaw-*` namespace → flagged as drift
- Completion claims without tool output → logged

## Kernel-level enforcement (Allura_Memory)

The RuVix kernel in `Allura_Memory/src/kernel/` provides defense-in-depth:

- **Proof-of-intent**: Every mutation requires HMAC-signed proof (`proof.ts`)
- **12 syscalls**: The only path to database mutation (`syscalls.ts`)
- **Gate**: Monkey-patches MCP tools to intercept calls lacking kernel proof (`gate.ts`)
- **Policy evaluation**: Runtime policy check before every mutation (`policy.ts`)
- **Target resolution**: Validates mutation targets before execution (`target-resolver.ts`)
- **Audit trail**: Every syscall logged with actor, intent, proof, and result

## Enterprise extensibility model

The governance framework is designed for extension in regulated environments:

1. **Add a policy** — create `.opencode/policy/<name>.md` with the constraint definition
2. **Add a hook** — extend `allura-governance.ts` with a pattern matcher for the new policy
3. **Add a kernel policy** — extend `Allura_Memory/src/kernel/policy.ts` with a policy entry
4. **Set enforcement level** — P0 (block), P1 (warn), P2 (log) based on risk tolerance
5. **Enable hard-block** — `ALLURA_GOVERNANCE_HARD_BLOCK=1` for production enforcement

## Policy hierarchy

1. User's explicit instructions (CLAUDE.md, AGENTS.md, direct requests) — highest
2. These policies — enforce AGENTS.md constraints
3. Plugin hooks — runtime enforcement of policies
4. Kernel — cryptographic enforcement of mutation safety
5. Default system prompt — lowest

If `AGENTS.md` says X and a policy says Y, `AGENTS.md` wins. Policies are the enforcement
mechanism, not a replacement for human-authored guidance.

## File map

```
.opencode/
├── policy/
│   ├── README.md                    # This policy index and hierarchy
│   ├── group_id-required.md         # P0: tenant scoping
│   ├── append-only-traces.md        # P0: no trace mutation
│   ├── supersedes-versioning.md     # P0: versioned knowledge
│   ├── mcp-only-db-access.md        # P0: no direct DB access
│   ├── allura-namespace-only.md     # P0: namespace enforcement
│   ├── hitl-promotion-gate.md       # P1: human approval for promotion
│   ├── ruvector-boundary.md         # P1: execution/governance boundary
│   ├── logs-not-knowledge.md        # P2: traces ≠ knowledge
│   └── evidence-before-claims.md    # P2: no claims without evidence
└── plugins/
    ├── allura-governance.ts          # Runtime enforcement plugin
    └── README.md                     # Plugin documentation

Allura_Memory/src/kernel/
├── gate.ts                           # Enforcement gate (intercepts MCP calls)
├── proof.ts                          # Proof-of-intent engine (HMAC)
├── syscalls.ts                       # 12 kernel syscalls (only mutation path)
├── policy.ts                         # Policy evaluation engine
├── target-resolver.ts                # Target validation
└── ruvix.ts                          # Kernel initialization
```