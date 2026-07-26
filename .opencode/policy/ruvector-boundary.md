# Policy: RuVector Boundary

**Severity:** P1 — warn + require confirmation
**Source:** `AGENTS.md` → "RuVector executes, Allura governs. Neither side reaches across the line."
See also: `docs/archive/factory-planning/allura-ruvector-integration-adr.md`

## Rule

RuVector and Allura have a hard boundary. Each side owns its concerns and does not reach across.

| RuVector owns (the engine) | Allura owns (the governance) |
|---|---|
| Vector storage | Tenancy (`group_id`) |
| Retrieval (HNSW, GNN, Graph RAG) | HITL approval / curator |
| Routing (Tiny Dancer, semantic routing) | Knowledge promotion |
| DAG execution (rudag) | SUPERSEDES versioning |
| Circuit breakers (tiny-dancer) | Append-only audit history |

**Principle:** depend on the *interface*, not the implementation. RuVector is a high-performance execution substrate Allura calls; it never sees or enforces tenancy, approval, or lineage — those stay in the Allura API layer.

## Why

The boundary keeps governance testable and swappable. If RuVector enforced `group_id`, we'd have to re-implement governance if we ever swapped engines. By keeping the boundary hard, Allura's governance works regardless of the retrieval engine underneath.

## Allowed

- Allura calls RuVector via its interface → retrieval results flow back
- RuVector stores/computes on vectors → opaque to Allura internals
- Allura enforces `group_id`/approval/versioning → before and after the RuVector call, never inside it

## Blocked

- RuVector code that reads or writes `group_id` (that's Allura's job)
- Allura code that reaches into RuVector internals (HNSW params, GNN weights)
- Coupling that makes RuVector responsible for governance outcomes
- Coupling that makes Allura responsible for retrieval correctness

## Enforcement

- **Agent instruction:** Agents designing integration MUST respect the table above. If you're adding `group_id` checks to RuVector code, you're crossing the boundary — move the check to the Allura API layer.
- **Code review:** `allura-code-review` flags cross-boundary coupling.

## References

- `docs/archive/factory-planning/ruvector-cicd-execution-plan.md` — integration plan
- `docs/archive/factory-planning/allura-ruvector-integration-adr.md` — boundary ADR