# Policy: HITL Promotion Gate

**Severity:** P1 — warn + require confirmation
**Source:** `AGENTS.md` → "Approval — nothing goes active without it. HITL gate; agents cannot promote their own knowledge."

## Rule

The curator pipeline **proposes** Insights. It does not **decide**. Nothing becomes active knowledge in Neo4j without Human-In-The-Loop (HITL) approval.

Agents MUST NOT:
- Promote their own proposed Insights to active status
- Bypass the approval queue
- Auto-approve based on confidence scores alone (confidence ≥ 0.85 *proposes*; it does not *promote*)

## Why

Layer 4 of the six-layer architecture is "Approval." This is the gate that keeps logs from becoming knowledge without human judgment. If agents could promote their own work, the curator layer would be meaningless — every agent would be its own authority.

The approval queue exists to catch:
- Hallucinated Insights (plausible-sounding, wrong)
- Mis-scoped proposals (wrong `group_id`, wrong tenant)
- Duplicate Insights (already known, restated)
- Premature promotion (Insight built on unverified traces)

## Workflow

```
Agent runs task
   → activity saved as raw traces (layer 1)
      → curator reads traces, proposes Insight (layer 2)
         → Insight appears in approval queue (layer 4 gate)
            → HITL approves or rejects
               → approved Insight written to Neo4j (layer 3)
                  → retrieval layer serves it to future agents (layer 5)
```

## Allowed

- Curator proposes an Insight → approval queue (always allowed)
- HITL user approves → Insight promoted (the gate working as intended)
- Agent queries approved Insights → retrieval layer (read-only)

## Blocked

- Agent calls `memory_promote` or equivalent on its own proposal
- Agent marks its own Insight as `status: "active"`
- Agent writes directly to Neo4j `:Insight` nodes (see `supersedes-versioning.md` and `mcp-only-db-access.md`)

## Enforcement

- **Skill gates:** `allura-propose-promotion` proposes; `allura-approve-promotion` is the HITL action; `allura-promotion-roundtrip` verifies the receipt. The split enforces the gate.
- **Agent instruction:** Agents MUST NOT self-promote. Use `allura-propose-promotion` to nominate, then wait for HITL approval via `allura-approve-promotion`.

## Related Skills

- `allura-propose-promotion` — the proposal action
- `allura-approve-promotion` — the HITL approval action
- `allura-promotion-roundtrip` — verify the full promote→store→retrieve loop