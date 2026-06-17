# Phase 0 Backend Stories + Sprint Sequence

**Prepared:** 2026-06-12 | **Owner:** brooks-architect | **group_id:** allura-system | **Status:** Draft for sprint planning

Drafted from the Phase 0 candor list: *"Scheduled Tasks, Dreams, Settings, and Teams still need real
backend sources."* Each surface currently renders against stub/empty data. These four stories wire
real, governed backends. All four route through the **Layer 6 governed middleware** (see
`allura-governed-middleware-adr.md`), which is their shared P0 dependency — none of them ships ungated.

> **Note on placement:** these are authored here in `allura-memory` because the app repo isn't mounted
> in this session. Move them into the Allura-TeamRam epic tree (or generate them via `bmad-create-story`
> from the project-local CLI) before implementation, so they pick up the live epic context and Brain
> hydration `bmad-create-story` is designed to attach.

## Shared governance requirements (apply to all four stories)

- **`group_id` scoping:** every read/write derives `group_id` server-side from the authenticated
  principal (`^allura-[a-z0-9-]+$`); never from client input. Missing `group_id` is a hard failure.
- **Read scope:** current tenant **+** `allura-system` shared canon. Never another org's tenant.
- **Write scope:** current tenant only, tagged with `metadata.team` and `user_id`.
- **Audit:** state-changing actions append a governed event via the canonical MCP/connection path —
  never `docker exec`, never a direct store write.
- **Promotion:** anything that becomes durable knowledge goes through the HITL curator, not autonomously.
- **Loading states:** each surface exposes ready / empty / stale / error / degraded states — match the
  pattern Team RAM already shipped for Live Governance data from the curator queue.

---

## Story 1 — Scheduled Tasks: real backend source

**Problem:** the Scheduled Tasks surface renders stub data; it has no governed source of scheduled
task definitions or run history.

**Acceptance criteria**
- **Given** an authenticated principal in tenant `allura-<org>`, **when** they open Scheduled Tasks,
  **then** the list returns only that tenant's tasks (+ any `allura-system` canon), scoped server-side.
- **Given** a scheduled task exists, **when** it runs, **then** a governed run event is appended
  (append-only) with `group_id`, `metadata.team`, `user_id`, and outcome.
- **Given** no tasks exist, **when** the surface loads, **then** it renders the **empty** state (not a spinner).
- **Given** the backend is unreachable, **then** the surface renders **degraded/error**, never a blank table.

**Notes / dependencies:** depends on the governed middleware (P0). Confirm whether task scheduling
reuses the existing `scheduled-tasks` MCP or needs a Brain-backed definition store. **Assumption:** read
model is Brain events; verify against the actual scheduler before estimating.

---

## Story 2 — Dreams: real backend source

**Definition (resolved 2026-06-12 from the Anthropic Managed-Agents "Dreams" and OpenClaw "dreaming"
references):** A **Dream** is an asynchronous reflection / memory-consolidation job — Allura's
**Curator Pipeline (Layer 2) surfaced as a first-class, user-visible object.** It reads a set of past
sessions / raw traces (Layer 1) **plus** the existing approved Knowledge, and produces *proposed*
insights: duplicates merged, stale or contradicted entries replaced with the latest value, and new
patterns surfaced. It **proposes, never decides** — output lands in the curator / approval queue, never
active knowledge. Inputs are never modified (append-only).

This is the Allura-governed analogue of those two systems, with one deliberate difference: **promotion
stays HITL.** OpenClaw's "deep phase" auto-writes durable memory; Allura must route Dream output through
the curator gate instead — autonomous promotion is forbidden (invariant #4).

**Acceptance criteria**
- **Given** an authenticated principal, **when** they create a Dream, **then** its inputs are
  (selected sessions / trace range **+** existing knowledge scope), all tenant-scoped via server-derived
  `group_id` (current tenant + `allura-system` canon on read).
- **Given** a Dream runs, **then** it emits **proposed** insights into the curator queue (status
  `pending`); it **never** writes active knowledge and **never** bypasses the HITL gate.
- **Given** a Dream proposes a revision to an existing insight, **when** that proposal is approved,
  **then** a new Neo4j node is created linked `SUPERSEDES → prior`; a historical node is never mutated.
- **Given** the job lifecycle, **then** the surface shows `pending` / `running` / `completed` /
  `failed` / `canceled`, and the input sessions + store are immutable for the run's duration.
- **Given** empty / stale / error / degraded backend conditions, **then** each renders its explicit state.

**Notes / dependencies:** middleware (P0). **No longer spike-blocked** — definition is resolved.
Remaining design choices (not blockers): (a) does a Dream reuse the existing curator-pipeline service
end-to-end, or is it a distinct trigger that feeds the same queue? (b) the inputs UI (session picker /
trace range); (c) the **235-deep curator backlog** means Dream output volume needs a rate/quota guard
before launch, or it will bury the queue further.

---

## Story 3 — Settings: real backend source

**Problem:** Settings renders against stubs; no governed persistence for tenant/user settings.

**Acceptance criteria**
- **Given** an authenticated principal, **when** they change a setting, **then** it persists scoped to
  their tenant, server-derived `group_id`, and a governed audit event records who changed what.
- **Given** tenant-level vs user-level settings, **then** scope is explicit (tenant settings require
  the appropriate permission; the middleware's authZ gate enforces it → `403` if lacking).
- **Given** backend error/degraded, **then** Settings fails safe (shows last-known + a clear banner),
  never silently writes.

**Notes / dependencies:** middleware (P0), especially its authZ step — Settings is the surface most
likely to expose privilege boundaries. **Assumption:** settings are a small key/value model per
(group_id, scope, key); verify the existing shape before building.

---

## Story 4 — Teams: real backend source

**Problem:** Teams renders stub data; no governed source for team membership/roles.

**Acceptance criteria**
- **Given** the tenancy model (org = `group_id`, **team = `metadata.team` role within the tenant**),
  **when** Teams loads, **then** it lists teams as roles inside the current org — **not** as separate
  tenants. (Enforces `allura-tenancy-model-adr.md`; reject any `allura-team-*` group_id as drift.)
- **Given** a team membership change, **then** it appends a governed event scoped to the org tenant.
- **Given** empty / stale / error / degraded, **then** each renders its explicit state.

**Notes / dependencies:** middleware (P0) **and** alignment with the tenancy ADR — this is the surface
most at risk of reintroducing the "team as tenant" drift the canon retired. **Validation:** any read
that produces a non-org `group_id` is a defect, not data.

---

## Sprint sequence (for `bmad-sprint-planning`)

Sequenced for steady, low-risk progress — governance foundation first, then features by ascending
domain uncertainty, with the two highest-drift-risk surfaces (Teams, Dreams) gated behind their
definitional questions.

| Order | Item | Type | Blocked by | Rationale |
|---|---|---|---|---|
| 0 | **Fix `.env` PostgreSQL credential drift** | quick-dev | — | Must precede any live gate re-run; do from project CLI |
| 1 | **Governed middleware** (ADR → impl) | P0 arch + dev | `.env` fix | Layer 6 hole; all four features inherit it |
| 2 | **Settings** | story | Middleware | Smallest, well-defined; exercises authZ gate first |
| 3 | **Scheduled Tasks** | story | Middleware | Defined; validates governed run-event logging |
| 4 | **Teams** | story | Middleware + tenancy ADR | Higher drift risk; needs tenancy guardrail in place |
| 5 | **Dreams** | story | Middleware | Definition resolved (governed curator-pipeline job, HITL-gated); add a queue rate/quota guard given the 235-deep backlog |
| 6 | **TALON + IRIS reviews** | review | Stories complete | Product-feel/browser reviews — close before release approval |
| 7 | **Retrospective + curator promotion** | retro | Reviews pass | Capture learnings; promote insights via HITL (not autonomous) |

**Definition of Done for the epic:** all four surfaces serve real, tenant-scoped, audited data through
the governed middleware; `audit_invariant_check` stays 6/6 green; TALON + IRIS sign off; learnings
promoted through the curator. Only then does Phase 0 move from *In Review* to *release-approved*.
