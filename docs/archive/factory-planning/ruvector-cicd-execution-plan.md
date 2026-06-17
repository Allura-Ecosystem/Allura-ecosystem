# RuVector Integration + CI/CD — Execution Plan

**Status:** Draft for approval · **Date:** 2026-06-10 · **Owner:** Brooks (orchestrator)
**Governance:** `group_id = allura-team-ram` on all Brain ops · append-only · HITL promotion

---

## The plan in one paragraph

Four workstreams run mostly in parallel. **WS1** replaces the pgvector bridge with the
native RuVector extension (the biggest perf win, but highest risk — gate it behind a
feature flag and dual-read validation). **WS2** adopts `rudag` and `tiny-dancer` from the
RuVector ecosystem — low risk, high leverage now that 5 teams need orchestration and
fault isolation. **WS3** extracts Allura's governance into `@ruvector/governance` and
upstreams it — this is the contribution that gives back. **WS0 (CI/CD)** lands first
because nothing else is safe to ship without it. Sequence: **WS0 → (WS1 ‖ WS2 ‖ WS3)**.

---

## Confirmed current state (from recon)

| Area | State | Evidence |
|------|-------|----------|
| `@ruvector/sona` | Active, v0.1.6 — trajectory wrapper around agent invocations | conversation + recon |
| Native RuVector | **NOT active** — `ruvector_function_count = 0` | TALON audit 2026-06-02 |
| Vector search | pgvector bridge in `src/lib/ruvector/bridge.ts` (`retrieveMemories()`) | scout recon |
| Embeddings | `qwen3-embedding:8b`, 4096d, local (Ollama) | `embedding-service.ts` |
| Governance | curator pipeline (`src/curator/`), HITL approve/reject/promote, SUPERSEDES on Neo4j, `group_id` enforced at write, append-only events | scout recon |
| CI — allura-memory | Strong: ~10 workflows (typecheck/lint/unit/curator/integration/E2E/MCP/brand-audit) | recon |
| CI — TeamRAM | Weak: flat lint+typecheck+test, no E2E, no Docker | recon |
| CI — dashboard | Weak: build+lint only, no tests | recon |
| CD / Docker publish | **None** — Dockerfiles exist, nothing pushes to GHCR | recon |

> ⚠️ **Verify before WS2 starts:** confirm `@ruvector/rudag` and `@ruvector/tiny-dancer`
> are published, their versions, and their licenses. Adoption is a real dependency
> decision — Scout confirms availability first, then we commit.

---

## WS0 — CI/CD Foundation (lands first, P0)

**Why first:** native RuVector migration and a new published package are both unshippable
without release automation and cross-contract validation. Build the safety net, then climb.

| # | Task | Owner | Gate |
|---|------|-------|------|
| 0.1 | Docker image publish → GHCR (`Dockerfile.mcp`, `Dockerfile.dashboard`) | Hightower | `docker pull` works from clean machine |
| 0.2 | Add tests + E2E lane to TeamRAM CI | Hightower + Woz | green E2E against live PG+Neo4j |
| 0.3 | Add tests + E2E lane to dashboard CI | Hightower + Woz | green |
| 0.4 | Reusable CI template for new teams (Raleigh/Charlotte/Penasoto) | Hightower | one team adopts it clean |
| 0.5 | Cross-contract validation (TeamRAM API ↔ Memory contracts ↔ Dashboard) | Hightower + Pike | contract drift fails CI |
| 0.6 | Release automation (changelog, version bump, GH releases) | Hightower | tagged release auto-publishes |

---

## WS1 — Native RuVector Migration (P1, highest risk)

**Goal:** retire the pgvector bridge for native HNSW + SIMD + GNN self-learning.

| # | Task | Owner | Gate |
|---|------|-------|------|
| 1.1 | Spin RuVector as a container in `docker-compose.yml` (alongside PG+Neo4j) | Hightower + Knuth | service healthchecks pass |
| 1.2 | Implement native extension behind a feature flag (`RUVECTOR_NATIVE=on`) | Woz | flag off = current behavior unchanged |
| 1.3 | Dual-read shadow mode: run native + pgvector, diff results, log divergence | Woz + Bellard | recall parity ≥ agreed threshold |
| 1.4 | Benchmark p95 latency: native vs bridge at realistic load | Bellard + Carmack | native p95 < bridge p95 |
| 1.5 | Cutover + remove bridge once shadow mode is clean for N days | Woz | `ruvector_function_count > 0` in prod |

**Risk controls:** feature flag + dual-read means zero blast radius until parity is proven.
Append-only invariant unaffected — this changes the *retrieval* path, not the trace store.

---

## WS2 — Adopt rudag + tiny-dancer (P1, low risk, high leverage)

**Why now:** 5 teams (RAM, Durham, Raleigh, Charlotte, Penasoto) need DAG orchestration
and fault isolation. Don't hand-roll what the ecosystem already ships.

| # | Task | Owner | Gate |
|---|------|-------|------|
| 2.0 | **Verify** packages exist, versions, licenses (MIT-compatible?) | Scout | go/no-go report |
| 2.1 | Adopt `@ruvector/rudag` for task scheduling / critical-path | Knuth + Woz | one team's pipeline runs on rudag |
| 2.2 | Adopt `@ruvector/tiny-dancer` circuit breakers + fallback chains | Woz | injected failure trips breaker, no cascade |
| 2.3 | Wire SONA trajectory data → routing feedback loop | Woz + Bellard | routing improves on replayed trajectories |

---

## WS3 — Upstream `@ruvector/governance` (P0 contribution)

**Why:** RuVector has no governance — agents self-promote, no append-only, no SUPERSEDES,
no HITL. That's Allura's moat. Packaging it is the upstream contribution.

| # | Task | Owner | Gate |
|---|------|-------|------|
| 3.1 | Extract curator pipeline + HITL approve/reject/promote into standalone pkg | Woz + Fowler | builds outside monorepo |
| 3.2 | Package SUPERSEDES versioning (Neo4j Cypher) as a pluggable interface | Knuth | `(v2)-[:SUPERSEDES]->(v1)` works via plugin |
| 3.3 | Package append-only enforcement + `group_id` tenant guard | Pike + Woz | violation rejected at write time |
| 3.4 | Define the RuVector plugin/extension interface contract | Pike + Brooks | clean surface, no monorepo leakage |
| 3.5 | Draft upstream PR + ADR for `@ruvector/governance` | Brooks | ADR logged to Brain (pending curator) |

> **Honest caveat (carry from prior ADR):** the plugin is prompt-/app-level
> defense-in-depth. The real wall stays in the Brain API — server-side `group_id`
> constraints, append-only schema, server-held tenant credentials. The package documents
> this boundary so adopters don't mistake the overlay for the enforcement.

---

## Sequencing & dependencies

```
WS0 (CI/CD)  ───────────────►  must be green before any publish/cutover
   │
   ├──► WS1 (native RuVector)   feature-flagged, dual-read, independent
   ├──► WS2 (rudag/tiny-dancer) gated on Scout's package verification (2.0)
   └──► WS3 (@ruvector/gov)     independent extraction, PR after WS0 release automation
```

## Open decisions (need your call)

1. **Native cutover threshold** — how many clean shadow-mode days before we remove the bridge?
2. **Governance package license** — MIT (matches RuVector) or copyleft to protect the moat?
3. **rudag adoption scope** — all 5 teams at once, or pilot on Team RAM first?

## Next Actions

1. Approve sequencing (WS0 first) and answer the 3 open decisions.
2. Dispatch Scout on **2.0** — verify `rudag` + `tiny-dancer` exist, versions, licenses (blocks WS2).
3. Dispatch Hightower on **0.1 / 0.2** — Docker→GHCR publish + TeamRAM E2E lane (unblocks everything else).
