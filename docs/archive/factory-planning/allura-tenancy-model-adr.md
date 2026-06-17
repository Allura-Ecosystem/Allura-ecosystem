# ADR: Allura Tenancy Model — Organization is the Boundary, Team is a Role

**Status:** Proposed (Brooks, 2026-06-10 — awaiting Sabir sign-off) | **Owner:** brooks-architect | **group_id:** allura-system

## Context

The Allura Operations Platform PRD v0.1 defines two tenancy concepts that cannot coexist:

- **PRD success metric:** "100% tenant isolation."
- **Brooks canon invariant:** every DB operation uses `group_id = 'allura-system'`.

A platform where every operation shares one `group_id` has *zero* isolation. This is the
load-bearing contract — every read, write, permission check, and audit query inherits it — so it
must be settled before any UI, dashboard, or additional team is built. Getting it wrong means
re-migrating every table, API, and memory query later.

## Decision

There is exactly **one** tenancy boundary, and it is the **organization**.

```text
Allura System (allura-system) -- shared canon / platform governance only
|
+-- Organization  =  TENANT  =  group_id   (allura-faithmeats, allura-difference-driven, allura-mortagate)
|   |
|   +-- Team  =  ROLE within the tenant   (metadata.team, NOT a group_id)
|   |   +-- Agent  (user_id persona)
|   |   +-- Agent
|   +-- Team
|
+-- Global Canon  (allura-system)  -- reusable patterns, system ADRs, cross-org insights
```

| Concept | Representation | Isolation role |
|---|---|---|
| **Organization** | `group_id` (`^allura-[a-z0-9-]+$`) | THE tenant boundary. Hard isolation. |
| **Team** | `metadata.team` field on events; agent `user_id` personas | A role/division *inside* a tenant. Not an isolation boundary. |
| **Agent** | `user_id` (e.g. `brooks-architect`, `bahari-curator`) | Identity/attribution only. |
| **Platform / shared canon** | `group_id = allura-system` | Reusable knowledge readable by all tenants; owned by no single org. |

### The ruling that hardens your draft (the slip I caught)

Your ADR-001 draft listed `allura-team-ram` as an example tenant `group_id`. **A team is not a
tenant.** Two reasons it must not be a `group_id`:

1. **Brain canon already deprecates it.** Hydration returned: *"Never use `allura-team-ram` — that's
   legacy."* Promoting it to a tenant id reintroduces the drift the canon retired.
2. **Teams are cross-organizational.** Team RAM builds software for Faith Meats *and* for Difference
   Driven *and* for the Allura platform itself. If Team RAM were its own `group_id`, Faith Meats'
   engineering memories and Difference Driven's would collapse into one bucket — breaking the very
   isolation metric this ADR exists to satisfy.

So: **Team RAM writing software for Faith Meats writes to `group_id = allura-faithmeats` with
`metadata.team = "team-ram"`.** The same team, serving the platform build, writes to
`allura-system`. The team is a lens, not a wall.

### Read / write scope rules

- **Write:** an agent writes only to the tenant it is currently serving (`allura-<org>`), tagged
  with its `metadata.team` and `user_id`.
- **Read:** an agent reads its current tenant **plus** `allura-system` (shared canon). It never
  reads another organization's tenant. That is the isolation guarantee, enforced at the API/CHECK
  layer, not by convention.
- **Promotion:** org-specific insights promote within the org tenant. Only patterns that are
  genuinely reusable across orgs promote *up* to `allura-system`, and only through the HITL curator
  (Bahari) — never autonomously.

## Why this preserves conceptual integrity

One boundary, one concept, applied everywhere. "Org = tenant" is the single idea a builder can hold
in their head and never get wrong. Team and agent become *attributes* of an event, not parallel
isolation schemes — which is what kept the model from fragmenting into "is this isolated by org, or
team, or agent?" (the question that would have haunted every query).

This also reconciles the PRD with the canon: tenant isolation is real (per-org `group_id`), and
the canon's `allura-system` is correctly demoted from "everything" to "shared canon tier."

## Consequences

- **Gain:** real isolation; cross-org teams without data bleed; a single mental model; the existing
  `^allura-[a-z0-9-]+$` constraint does the enforcement for free.
- **Give up:** team-level isolation *within* an org is now a soft (metadata) boundary, not a hard
  one. If a future org needs hard team walls (e.g. regulated separation), that org gets its own
  child `group_id` (`allura-<org>-<unit>`) — the escape hatch, used sparingly, never by default.
- **Migration:** any existing team-named or other legacy non-org `group_id`s are drift; re-tag to
  the correct org tenant + `metadata.team` rather than carrying them forward.

## Risks

| Risk | Mitigation |
|---|---|
| Metadata-based team scoping is queried inconsistently | Provide one retrieval helper that takes `(group_id, team?)`; agents never hand-roll the filter |
| An org genuinely needs hard team isolation | Child `group_id` escape hatch (`allura-<org>-<unit>`); decided per-org, documented |
| Legacy team-named `group_id`s linger | Migration sweep + CHECK constraint rejects non-org tenant ids going forward |

## Open Questions

1. Do we reserve a naming registry for org `group_id`s, or mint on provisioning?
2. Is `metadata.team` a free string or an enum validated against the org's installed manifests?
3. Does shared-canon promotion (`-> allura-system`) need a stricter quorum than in-org promotion?
