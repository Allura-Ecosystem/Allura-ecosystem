# Policy: MCP-Only DB Access

**Severity:** P0 — block on violation
**Source:** `AGENTS.md` → "DB operations go through MCP tools only — never docker exec."

## Rule

All database operations against PostgreSQL or Neo4j MUST go through governed MCP tools (e.g. the Allura Brain MCP at `localhost:5888/mcp`, Postgres MCP, Neo4j MCP).

Never use `docker exec` to run SQL, Cypher, or shell commands inside the database containers. Never use `psql` or `cypher-shell` directly against the database ports from agent tool calls.

## Why

The six-layer architecture depends on a single controlled door (layer 6: Policy / API Layer). If agents can bypass the API and hit the database directly, the governance model is meaningless:

- No `group_id` enforcement (see `group_id-required.md`)
- No append-only audit (see `append-only-traces.md`)
- No SUPERSEDES versioning (see `supersedes-versioning.md`)
- No HITL approval gate (see `hitl-promotion-gate.md`)

Direct DB access collapses every layer at once.

## Allowed

- Allura Brain MCP at `localhost:5888/mcp` — the canonical governed endpoint
- Postgres MCP (if configured) for governed SQL access
- Neo4j MCP (if configured) for governed Cypher access
- Migration tooling that runs through the API layer

## Blocked

- `docker exec -it <pg_container> psql ...`
- `docker exec -it <neo4j_container> cypher-shell ...`
- `psql -h localhost -p 5432 ...` from agent tool calls
- `cypher-shell -a bolt://localhost:7687 ...` from agent tool calls
- Any command that connects directly to the DB port, bypassing the API

## Enforcement

- **Hook:** `block-db-exec` (in `.opencode/plugins/allura-governance.ts`) inspects Bash tool calls for `docker exec` targeting postgres/neo4j containers and direct DB client invocations.
- **Agent instruction:** Agents MUST use MCP tools for all DB operations. If an MCP tool is unavailable, escalate — do not fall back to `docker exec`.

## Exceptions

- **Human operators** running migrations during scheduled maintenance — not agents.
- **CI/CD pipelines** running governed migrations through the API — not direct exec.

If you are an agent reading this, there are no exceptions for you.