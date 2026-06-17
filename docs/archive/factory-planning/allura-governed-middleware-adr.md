# ADR: Governed Request Middleware — Replacing the Deleted Edge Gate (Layer 6)

**Status:** Proposed (2026-06-12 — awaiting Sabir sign-off) | **Owner:** brooks-architect | **group_id:** allura-system | **Priority:** P0

## Context

Phase 0 of the Mission Control / dashboard work deleted the request middleware and shipped without a
replacement. The candor note from that session lists this explicitly: *"the deleted middleware needs
a governed replacement."* This is not a feature gap — it is a hole in **Layer 6 (Policy / API Layer)**,
the single controlled door through which every read and write is supposed to pass.

The 6-layer model says Layer 6 enforces three things on the request path: **(1) project-level access
(`group_id` scoping), (2) agent/user permissions, and (3) audit logging.** Middleware is where those
are applied uniformly, before a request reaches any route handler. With it deleted, each handler now
has to remember to do this itself — which is exactly the prompt-/convention-level enforcement that
Brooks' end-of-session assessment (2026-06-10, point 3) warned against:

> *"Kernel enforcement > prompt enforcement. Append-only must be a DB rule, HITL an API gate. Prompt-level governance = defense-in-depth, never the wall. A regulator will ask which invariants are enforced vs aspirational."*

What we **do** still have (verified live against the Brain on 2026-06-12, `allura-system`):

- `group_id` CHECK constraint present on the events table (14 constraints) — **kernel teeth intact.**
- Append-only enforced structurally (no `updated_at` column).
- Neo4j SUPERSEDES versioning, HITL promotion, and `allura-*` namespace all pass, 0 violations.
- Team RAM's Phase 0 work landed the **route contract anchors** and **correct 401 (unauthenticated)
  vs 403 (forbidden)** behavior — the *semantics* the middleware should enforce already exist.

So the kernel (DB CHECK) and the contract (401/403, route anchors) are in place. The missing piece is
the **edge gate that applies them on every request** instead of per-handler. That is what this ADR
replaces — and it must be settled before the Scheduled Tasks / Dreams / Settings / Teams backends are
wired, because each of those adds new protected routes that would otherwise inherit the hole.

> **Assumption to verify (no app-repo access this session):** the deleted file was the framework
> edge middleware (e.g. Next.js `middleware.ts`) doing auth/session gating + route protection.
> Verify from the project-local CLI: `git log --diff-filter=D -- '**/middleware.ts'` and confirm what
> the deleted file actually covered. If it also did request rewriting/i18n/etc., scope that separately
> — this ADR governs only the **access + audit** responsibilities.

## Decision

Reinstate a single **governed request middleware** as the one controlled door. It runs before every
route handler and is the only place the three Layer-6 responsibilities are applied. Handlers never
re-implement them.

The middleware enforces, in order, and **fails closed** at every step:

```text
request
  │
  1. AUTHENTICATE  → no/invalid session  ⇒ 401  (unauthenticated)
  │
  2. RESOLVE TENANT → derive group_id from the authenticated principal
  │                   (^allura-[a-z0-9-]+$); missing/invalid ⇒ hard failure (not a default)
  │
  3. AUTHORIZE     → principal lacks permission for this route/tenant ⇒ 403 (forbidden)
  │
  4. SCOPE         → inject resolved group_id into the request context; handlers read it,
  │                   never accept it from the client body/query
  │
  5. AUDIT         → append a governed access event (who / what route / group_id / decision)
  │                   via the canonical MCP/connection path — never a side-channel
  ▼
route handler  (operates only within the injected group_id)
```

| Responsibility | Rule | Failure mode |
|---|---|---|
| **Authenticate** | Valid session required on all non-public routes | `401` |
| **Resolve tenant** | `group_id` derived server-side from principal, never from client input | Hard failure — missing `group_id` is a hard failure per invariant #1 |
| **Authorize** | Permission checked against route + tenant | `403` |
| **Scope** | `group_id` injected into request context; handlers inherit it | Handler that reads no scope = build-time lint failure |
| **Audit** | Every gated request logged through the canonical door | Audit write failure ⇒ request fails closed |

### Non-negotiables (inherited from the governance invariants)

- **`group_id` on every operation**, derived server-side, matching `^allura-[a-z0-9-]+$`. The client
  never supplies it. (Invariant #1.)
- **Audit logging goes through the canonical MCP/connection path only** — never `docker exec`, never
  a direct store write. (Invariant #5.)
- **Fail closed.** An error in authN, tenant resolution, authZ, or audit denies the request. Open-by-
  default is the failure that put us here.
- **One door.** A route is either public (explicit allow-list) or it passes through the full gate.
  No third category, no per-handler exceptions.

### Public route allow-list

Health checks, static assets, and the login/auth callback are the only routes exempt from authN.
Everything else is gated. The allow-list is explicit and reviewed — the default for any new route is
**gated**, so the Scheduled Tasks / Dreams / Settings / Teams routes are governed the moment they exist.

## Why this preserves conceptual integrity

Layer 6 becomes a *place*, not a *practice*. "Access + audit live in the middleware" is the single
rule a builder holds in their head; route handlers shrink to business logic that trusts an already-
scoped, already-authorized, already-audited request. This is the same move the tenancy ADR made
(org = the one boundary): collapse a scattered concern into one enforced location so it can't drift.

It also closes the enforced-vs-aspirational gap Brooks flagged: the DB CHECK enforces `group_id` at
rest; this middleware enforces it on the wire. Together they are the wall, and prompt-level rules go
back to being defense-in-depth.

## Consequences

- **Gain:** uniform 401/403, server-derived tenant scoping, and an audit event on every gated
  request — for free, on every current and future route. Handlers get simpler.
- **Give up:** a small latency cost per request (one auth + one authZ + one audit append). Acceptable;
  the audit append is the product in regulated verticals, not overhead.
- **Migration:** audit Phase 0 handlers that may have started self-scoping after the deletion; strip
  the per-handler scoping once the middleware owns it, so there is exactly one source of truth.
- **Sequencing:** this lands **before** the four backend feature stories. They depend on it.

## Risks

| Risk | Mitigation |
|---|---|
| Middleware becomes a god-object (auth + rewrites + i18n + …) | This ADR scopes it to **access + audit only**; other edge concerns get their own, separately reviewed layer |
| Audit append on the hot path adds latency or a failure point | Append is fire-through-canonical-path with a bounded timeout; on audit failure, **fail closed** (deny) rather than skip the log |
| A new route silently ships ungated | Default-gated + explicit public allow-list; a lint/CI check fails the build if a route is neither gated nor allow-listed |
| `group_id` leaks in from client input | Middleware overwrites any client-supplied tenant value with the server-derived one before handlers run |
| Edge runtime can't reach the canonical audit path | If the framework edge runtime can't call the MCP/DB path, run the gate in a node runtime segment; verify during spike |

## Open Questions

1. **Runtime:** does the gate run in the framework edge runtime, or a node runtime segment? Driven by
   whether the canonical audit/MCP path is reachable from the edge. (Spike before build.)
2. **Audit granularity:** every gated request, or only mutations + denials? Regulated-vertical posture
   argues for every request; cost argues for sampling reads. Decide per the bank-audit requirement.
3. **Permission source:** are route→permission mappings static config, or resolved from the tenant's
   installed manifests (consistent with `metadata.team` validation in the tenancy ADR)?
4. **Confirm scope of the deleted file** (see Assumption above) before implementation, so we replace
   what was lost without silently dropping a non-access responsibility it also carried.

## Verification plan (Definition of Done for this ADR's implementation)

- A request with no session → `401`; valid session, wrong tenant → `403`; valid + authorized → `200`,
  scoped to the server-derived `group_id`.
- Every gated request produces exactly one governed audit event via the canonical path.
- A test route that omits scope handling fails CI.
- `audit_invariant_check` stays 6/6 green after the change (re-run against `allura-system`).
- Live E2E mirrors the Phase 0 checkpoint suite (the 401/403 + route-anchor tests already exist).
