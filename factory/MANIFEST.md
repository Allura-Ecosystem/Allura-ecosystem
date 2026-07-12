# Allura Agent Factory — Manifest

## Architecture

The Agent Factory is the shipyard. It takes client requirements in → produces packaged agent teams out, with Allura governance baked in.

```
client brief → (1) SPEC → (2) BUILD → (3) OVERLAY → (4) VALIDATE → (5) PACKAGE → (6) DEPLOY
```

## Directory Layout

```
factory/
├── MANIFEST.md              ← This file
├── templates/
│   ├── team.yaml            ← BMad-compatible team module manifest
│   ├── agent.md             ← Agent persona spec template
│   └── overlay.yaml         ← Governance overlay template (from ADR)
├── validate.sh              ← Validates module structure + Allura gates
├── teams/
│   ├── penasoto/            ← Mortgage audit team (packaged)
│   │   ├── team.yaml
│   │   ├── agents/          ← 7 agent specs
│   │   └── overlay.yaml
│   ├── raleigh/             ← Faith Meats (specs only, needs build)
│   │   ├── team.yaml
│   │   └── agents/          ← 15 agent specs
│   └── charlotte/           ← Difference Driven (specs only, needs build)
│       ├── team.yaml
│       └── agents/          ← 6 agent specs
└── presets/                 ← Reusable agent archetypes
```

## Standards

Every team module must pass:

1. **Structure** — `team.yaml` valid YAML, `agents/*.md` exist, `overlay.yaml` present
2. **Allura gate** — Every agent spec includes `group_id`, `user_id`, `allura-memory-skill`
3. **Governance** — Overlay enforces pol-001 through pol-006 (append-only, SUPERSEDES, HITL)
4. **BMad compliance** — Team manifest meets BMad module schema

## Capabilities

| Capability | Status | Notes |
|-----------|--------|-------|
| Allura Brain (MCP) | ✅ Active | `localhost:5888/mcp`, group_id-scoped |
| PostgreSQL (episodic) | ✅ Active | Port 5432, append-only traces |
| RuVector graph adapter | ✅ Production default | `GRAPH_BACKEND=ruvector` (AD-49 cutover 2026-07-12). PG tables: `graph_memories`, `graph_supersedes`, `graph_structural_nodes`, `graph_structural_edges` |
| Neo4j (fallback) | ✅ Available | `GRAPH_BACKEND=neo4j` — read-only fallback for one release post-cutover |
| Dual-read mode | ✅ Available | `GRAPH_DUAL_READ=true` — wraps both backends, logs divergence |
| Crate adapter (Path B) | 🔲 Opt-in spike | `GRAPH_BACKEND=ruvector-crate` — 13/16 methods, 3 throw unsupported (G1/B3) |
| Vector search (pgvector) | ✅ Active | 768d embeddings, hybrid BM25 + ANN RRF |
| HITL curator | ✅ Active | Promotion threshold 0.85, `curator:approve` gate |
