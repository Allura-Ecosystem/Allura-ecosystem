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

## 2. Harnesses — Agent Teams

### allura-team-ram
- **Repo:** `github.com/Allura-Ecosystem/allura-team-ram`
- **Role:** Engineering harness — deep implementation, architecture, data/schema, long build/test loops
- **Stack:** OpenCode + Claude Code, 10 agents, 53 skills, 35 commands
- **Visibility:** Public
- **Sister team:** TALON (code check, ship readiness)
- **Allura connection:** ✅ Wired — all agents have `allura-memory-skill` + brain blocks

### allura-team-durham
- **Repo:** `github.com/Allura-Ecosystem/allura-team-durham`
- **Role:** Brand harness — brand strategy, Figma extraction, copy, market doctrine, brand packets
- **Stack:** OpenCode + Claude Code, 9 agents, allura-memory-skill
- **Visibility:** Private
- **Sister team:** IRIS (UX QA, product feel, accessibility)
- **Allura connection:** ✅ Wired — dual-platform (OpenCode + Claude Code), 18 agent configs

---

## 3. Plugin System

### allura-plugins
- **Repo:** `github.com/Allura-Ecosystem/allura-plugins`
- **Role:** Canonical dual-runtime plugin catalog for the Allura ecosystem
- **Visibility:** Private
- **Contents:** Plugin specs, runtime adapters, marketplace metadata

---

## 4. Agent Factory

### factory/ (in this repo)
- **Role:** Shipyard — takes client requirements → produces packaged agent teams with Allura governance baked in
- **Pipeline:** SPEC → BUILD → OVERLAY → VALIDATE → PACKAGE → DEPLOY
- **Teams built:**
  - `penasoto/` — Mortgage audit team (7 agents, packaged)
  - `raleigh/` — Faith Meats (15 agents, specs only)
  - `charlotte/` — Difference Driven (6 agents, specs only)
- **Validation:** `validate.sh` checks structure + Allura gates
- **CI:** `.github/workflows/team-ci.yml` — validates on push/PR

---

## 5. Client Projects

| Project | Location | Description |
|---------|----------|-------------|
| Mortgage Audit | `allura module/mortgage-audit/` | Client project — Penasoto team |
| Payload Website | `websites/payload/` | Difference Driven website |
| Nanoclaw v2 | `nanoclaw-v2/` | Fork of `nanocoai/nanoclaw` |

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
Allura_Memory (brain)
    ├── consumed by → allura-team-ram (engineering)
    ├── consumed by → allura-team-durham (brand)
    ├── consumed by → allura-plugins (plugin catalog)
    ├── consumed by → all client projects
    └── governed by → RuVix (POL-001..006)

allura-team-ram (engineering)
    └── sister team → TALON (code review, deploy, ship readiness)

allura-team-durham (brand)
    └── sister team → IRIS (UX QA, product feel, accessibility)

Agent Factory (this repo)
    └── produces → packaged agent teams with Allura governance
```

---

## 9. Notion Planning Source

The canonical planning board is the **Allura Work Board** on Notion. This repo's `ECOSYSTEM.md` is the static index; the Notion board is the dynamic task tracker.

---

## 10. Health & Status

| Component | Status | Notes |
|-----------|--------|-------|
| Allura_Memory | ✅ Production | 8.5/10 quality, 29/29 E2E tests |
| PostgreSQL | ✅ Healthy | pgvector 0.8.2, HNSW index valid |
| Neo4j | ✅ Healthy | 9 indexes + 1 constraint, 81 Memory nodes |
| Ollama (embeddings) | ✅ Healthy | qwen3-embedding:8b, 1024d Matryoshka |
| allura-team-ram | ✅ Wired | 10 agents, Allura-connected |
| allura-team-durham | ✅ Wired | 9 agents, dual-platform |
| allura-plugins | 🟢 Active | Private catalog |
| Agent Factory | 🟢 Active | 3 team specs, CI pipeline |
| WhatsApp bridge | ✅ Healthy | Auto-recovery verified |
| Perplexica search | ✅ Healthy | 1.12.1, streamable-http transport |
| Penpot CLI harness | ✅ Healthy | 38/38 tests, 17 command groups |

---

*Last updated: 2026-06-17*
