# Allura Ecosystem Policies

These policies are the **enforced** form of the conventions in `AGENTS.md`. They are the non-negotiable constraints of the Allura six-layer memory architecture.

Agents MUST read and follow these policies. Hooks in `.opencode/plugins/` audit and block violations.

## Policy Index

### P0 — Non-negotiable (block on violation)

| Policy | Enforces |
|--------|----------|
| [`group_id-required.md`](./group_id-required.md) | Every memory op carries `group_id: "allura-system"` |
| [`append-only-traces.md`](./append-only-traces.md) | No UPDATE/DELETE on PostgreSQL trace rows |
| [`supersedes-versioning.md`](./supersedes-versioning.md) | Neo4j Insight nodes versioned via SUPERSEDES, never edited |
| [`mcp-only-db-access.md`](./mcp-only-db-access.md) | DB ops via MCP tools only — no `docker exec` |
| [`allura-namespace-only.md`](./allura-namespace-only.md) | Flag any `roninclaw-*` as drift |

### P1 — Governance gates (warn + require confirmation)

| Policy | Enforces |
|--------|----------|
| [`hitl-promotion-gate.md`](./hitl-promotion-gate.md) | Curator proposes; only HITL promotes |
| [`ruvector-boundary.md`](./ruvector-boundary.md) | RuVector executes, Allura governs |

### P2 — Disciplinary (warn + log)

| Policy | Enforces |
|--------|----------|
| [`logs-not-knowledge.md`](./logs-not-knowledge.md) | Raw traces never become Insights without curator + approval |
| [`evidence-before-claims.md`](./evidence-before-claims.md) | No "done" without verification output |

## Enforcement

Policies are enforced two ways:

1. **Agent instruction** — agents read these files and follow them. CLAUDE.md/AGENTS.md already establishes the constraint; these files make it explicit and citable.
2. **Plugin hooks** — `.opencode/plugins/allura-governance.ts` audits tool calls and blocks P0 violations at runtime.

## Hierarchy

Per the superpowers `using-superpowers` skill:

1. User's explicit instructions (CLAUDE.md, AGENTS.md, direct requests) — highest
2. These policies — enforce AGENTS.md constraints
3. Superpowers skills — override default behavior
4. Default system prompt — lowest

If `AGENTS.md` says X and a policy says Y, `AGENTS.md` wins. These policies are the *enforcement mechanism* for AGENTS.md, not a replacement for it.