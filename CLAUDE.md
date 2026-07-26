# CLAUDE.md

## What This Is
Allura ecosystem monorepo — governed memory engine, agent plugins, client deployments, and products.

The core principle: **logs are not knowledge.** Raw agent activity is cheap and noisy. Knowledge is expensive, versioned, and approved. Allura keeps these two things in separate layers and never lets them collapse into each other.

## Structure
```
allura-memory/          Brain — PostgreSQL + pgvector + MCP gateway
plugins/
  team-ram/             Engineering harness (Brooks, Woz, Scout, etc.)
  team-durham/          Brand harness
  catalog/              allura-plugins marketplace registry
clients/
  faith-meats/          Faith Meats stack — Hermes/nanoclaw + faithwebui (Ollama local: Troy/Omar/Jeeves)
  patriot-awning/       Patriot Awning — Next.js + Sanity + payload-planning/
  auntie-ny/            Auntie NY — Payload CMS client site
products/
  mortagate/            Veridact mortgage audit platform (portfolio)
  open-design/          Local-first design tool
docs/                   Architecture docs, ADRs, governance notes
_archive/               Sunsetted: aionui, nanoclaw-v2, factory, allura-crm
```

## Key Paths
- `plugins/team-ram/` — Team RAM harness (Brooks, Woz, Scout, etc.)
- `plugins/team-durham/` — Team Durham brand harness
- `plugins/catalog/` — allura-plugins marketplace registry
- `allura-memory/` — Allura Brain app (Next.js + PostgreSQL + Neo4j)
- `docs/` — Architecture docs and ADRs
- `docs/archive/factory-planning/ruvector-cicd-execution-plan.md` — RuVector integration plan
- `docs/archive/factory-planning/allura-ruvector-integration-adr.md` — RuVector boundary ADR

## The Six Layers (never collapse them)
1. **Raw Trace Store** — append-only. All agent activity goes to PostgreSQL. Never overwrite, never mutate a historical row. Every write carries `group_id` (pattern `^allura-[a-z0-9-]+$`).
2. **Curator Pipeline** — proposes, never decides. Emits proposed Insights into an approval queue. Cannot create active knowledge.
3. **Versioned Knowledge (Neo4j)** — immutable nodes. To change an Insight, create a new one and link it: SUPERSEDES, DEPRECATED, or REVERTED. Never edit a node in place.
4. **Approval** — nothing goes active without it. HITL gate; agents cannot promote their own knowledge.
5. **Retrieval Layer** — agents never touch the database. They query a service that reads approved Insights from Neo4j.
6. **Policy / API Layer** — one controlled door. All reads and writes go through governed endpoints.

## Rules
- Memory ops use `group_id: "allura-system"` — never legacy tenants
- PostgreSQL events are append-only — no UPDATE/DELETE
- Neo4j uses SUPERSEDES for versioning — never edit nodes
- DB ops via MCP tools only — never `docker exec`
- Allura Brain MCP at `https://mcp.faithmeats.org` (Cloudflare tunnel, canonical) or `localhost:5888/mcp` (local)
- `allura-*` namespace only — flag any `roninclaw-*` as drift
- Prioritize auditability, versioning, and clarity over speed

## Non-Negotiable Constraints
- Do not collapse layers.
- Do not allow direct writes to Neo4j without approval.
- Do not treat logs as knowledge.
- `group_id` on every read/write — missing it is a hard failure.
- Postgres traces are append-only — no UPDATE/DELETE on trace rows, ever.
- Neo4j versioning via SUPERSEDES — never mutate historical nodes.
- DB operations go through MCP tools only — never docker exec.
- `allura-*` namespace only — flag any `roninclaw-*` as drift.

## RuVector Integration Boundary
**RuVector executes, Allura governs.** Neither side reaches across the line.

| RuVector owns (the engine) | Allura owns (the governance) |
|---|---|
| Vector storage | Tenancy (`group_id`) |
| Retrieval (HNSW, GNN, Graph RAG) | HITL approval / curator |
| Routing (Tiny Dancer, semantic routing) | Knowledge promotion |
| DAG execution (rudag) | SUPERSEDES versioning |
| Circuit breakers (tiny-dancer) | Append-only audit history |

**Principle:** depend on the *interface*, not the implementation. RuVector is a high-performance execution substrate Allura calls; it never sees or enforces tenancy, approval, or lineage — those stay in the Allura API layer.

## Test
```bash
# TeamRAM integration tests
cd plugins/team-ram && bun run test-integration.ts
```

## Definition of Done (end-to-end)
1. An agent runs a task → activity is saved as raw traces.
2. The curator reads those traces → generates a proposed Insight.
3. The Insight appears in an approval queue.
4. A human or rule approves it → recorded as an audit event.
5. The Insight is written to Neo4j as an immutable node.
6. A new version links to the old one via SUPERSEDES.
7. A second agent runs → queries the retrieval layer → receives the approved Insight as context and uses it correctly.
8. Every step is logged, auditable, and reversible.