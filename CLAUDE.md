# CLAUDE.md

## What This Is
Allura ecosystem monorepo — agent harnesses, factory teams, memory system, and client projects.

## Key Paths
- `Agent-Harnesses/Allura-TeamRam/` — Team RAM harness (Brooks, Woz, Scout, etc.)
- `allura-memory/` — Allura Brain app (Next.js + PostgreSQL + Neo4j)
- `factory/` — Team manifests and agent templates
- `docs/` — Architecture docs and consolidation plans

## Rules
- Memory ops use `group_id: "allura-system"` — never legacy tenants
- PostgreSQL events are append-only — no UPDATE/DELETE
- Neo4j uses SUPERSEDES for versioning — never edit nodes
- DB ops via MCP tools only — never `docker exec`
- Allura Brain MCP at `localhost:5888/mcp`

## Test
```bash
cd Agent-Harnesses/Allura-TeamRam && bun run test-integration.ts
```
