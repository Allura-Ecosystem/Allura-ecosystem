# Allura Ecosystem — Topology & Index

This document is the **source-of-truth index** for the Allura ecosystem. It maps every project, its role, its dependencies, and how the pieces connect.

---

## 1. Core — The Brain

### Allura_Memory
- **Repo:** `github.com/Allura-Ecosystem/Allura_Memory`
- **Role:** Governed memory engine — the backbone of the ecosystem
- **Stack:** Next.js + Bun + TypeScript, PostgreSQL (pgvector), Neo4j, Ollama (embeddings)
- **Visibility:** Public
- **Architecture:**
  ```
  Agent → MCP → HTTP Gateway → RuVix Gate → PostgreSQL (episodic)
                                              ↓
                                         Curator (HITL)
                                              ↓
                                         Neo4j (semantic)
  ```
- **Key docs:** `docs/allura/BLUEPRINT.md`, `docs/allura/DESIGN.md`, `docs/allura/REQUIREMENTS-MATRIX.md`
- **Status:** ✅ Production — 8.5/10 quality sprint complete

---

## 2. Plugins — Agent Teams + Catalog

> In Claude Code, harnesses and plugins are the same layer. Every team is a plugin; the catalog distributes them.
> **Local path:** `plugins/`

### plugins/team-ram
- **Repo:** `github.com/Allura-Ecosystem/allura-team-ram`
- **Role:** Engineering harness — architecture, implementation, data/schema, build/test loops
- **Stack:** OpenCode + Claude Code, 10 agents (Brooks, Woz, Scout, etc.), 53+ skills, 35 commands
- **Visibility:** Public
- **Allura connection:** ✅ Wired — all agents have `allura-memory-skill` + brain blocks

### plugins/team-durham
- **Repo:** `github.com/Allura-Ecosystem/allura-team-durham`
- **Role:** Brand harness — strategy, Figma, copy, market doctrine, brand packets
- **Stack:** OpenCode + Claude Code, 9 agents, allura-memory-skill
- **Visibility:** Private
- **Allura connection:** ✅ Wired — dual-platform (OpenCode + Claude Code)

### plugins/catalog
- **Repo:** `github.com/Allura-Ecosystem/allura-plugins`
- **Role:** Marketplace registry — packages team-ram and team-durham as installable plugins
- **Visibility:** Private

---

## 3. Clients

> Live client deployments — each wired to Brain via `https://mcp.faithmeats.org`.
> **Local path:** `clients/`

| Client | Path | Stack | Status |
|--------|------|-------|--------|
| Faith Meats | `clients/faith-meats/` | Hermes/nanoclaw + faithwebui · Ollama local: Troy, Omar, Jeeves | ✅ Active — Stage 1 in progress |
| Patriot Awning | `clients/patriot-awning/` | Next.js + Sanity · `payload-planning/` = brand docs | 🟢 Active |
| Auntie NY | `clients/auntie-ny/` | Payload CMS | 🟢 Active |

---

## 4. Products

> Portfolio and first-party software.
> **Local path:** `products/`

| Product | Path | Description |
|---------|------|-------------|
| Mortagate | `products/mortagate/` | Veridact — mortgage audit replay & QC (Salesforce) |
| Open Design | `products/open-design/` | Local-first open-source Claude Design alternative |

---

## 5. Difference Driven (External Org)

> Difference Driven is a separate design agency business — **not part of the Allura ecosystem.**
> It has its own GitHub org and its own codebase. Team Durham (the agent harness) serves it, but the agency's deliverables live elsewhere.

| Item | Location | Notes |
|------|----------|-------|
| dd-site | `~/Projects/difference-driven/dd-site/` (local) | Agency website — Payload CMS. Push to Difference Driven GitHub org. |
| Team Durham harness | `plugins/team-durham/` | Stays in Allura — it's a plugin, not a deliverable |

---

## 6. Organization Infrastructure

### .github
- **Repo:** `github.com/Allura-Ecosystem/.github`
- **Role:** Org profile, community health files, issue/PR templates
- **Visibility:** Public
- **Local mirror:** `.github-public/`

### .ralph
- **Role:** Ralph orchestration config for the ecosystem
- **Config:** `.ralphrc` — agent, model, rate limits, allowed tools
- **Specs:** `.ralph/specs/stdlib/` — standard library specs

---

## 7. Governance

Allura is governed by six invariant policies enforced by the **RuVix gate**:

| Policy | Rule |
|--------|------|
| POL-001 | `group_id` constraint — every memory belongs to a tenant |
| POL-002 | No invalid `group_id` values |
| POL-003 | Append-only structure — no hard deletes |
| POL-004 | Neo4j SUPERSEDES — canonical memories can be superseded, not deleted |
| POL-005 | HITL promotion — no automatic semantic promotion without curator approval |
| POL-006 | `allura-*` namespace — all group_ids must follow the pattern |

Every memory write, promotion, and retrieval passes through the gate. No agent bypasses it.

---

## 8. Relationship Graph

```
allura-memory (brain)
    ├── consumed by → plugins/team-ram
    ├── consumed by → plugins/team-durham
    ├── consumed by → clients/faith-meats
    ├── consumed by → clients/patriot-awning
    ├── consumed by → products/*
    ├── exposed via → https://mcp.faithmeats.org (Cloudflare tunnel)
    └── governed by → RuVix (POL-001..006)

plugins/catalog (allura-plugins)
    └── packages → team-ram + team-durham as installable plugins
```

---

## 9. Notion Planning Source

The canonical planning board is the **Allura Work Board** on Notion. This repo's `ECOSYSTEM.md` is the static index; the Notion board is the dynamic task tracker.

---

## 10. Health & Status

| Component | Status | Notes |
|-----------|--------|-------|
| Allura_Memory (Brain) | ✅ Production | MCP gateway healthy at :5888 |
| PostgreSQL | ✅ Healthy | pgvector, HNSW index, append-only |
| Neo4j | ⚠️ Degraded — intentional | GRAPH_BACKEND=ruvector (AD-49); read-only fallback only |
| Curator queue | ✅ Clean | Drained 2026-07-26 ~05:07 UTC via hermes-curator · cron next run 06:00 EDT |
| Ollama (embeddings) | ✅ Healthy | qwen3-embedding:8b |
| Cloudflare tunnel | ✅ Live | mcp.faithmeats.org — split writes >~400 chars to avoid 520s |
| allura-team-ram | ✅ Wired | 10 agents, path corrected to plugins/team-ram/ |
| allura-team-durham | ✅ Wired | 9 agents, dual-platform |
| allura-plugins catalog | 🟢 Active | Private |
| Faith Meats stack | 🟡 Stage 1 in progress | D1 resolved: Ollama local Troy/Omar/Jeeves · D3 open |
| Agent Factory | 🗄️ Archived | Sunsetted — moved to _archive/ |

---

*Last updated: 2026-07-26*
