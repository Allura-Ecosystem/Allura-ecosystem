# Org Charter — Allura-Ecosystem (Platform Tenant)

**Status:** Proposed (Brooks, 2026-06-10 — awaiting Sabir sign-off) | **Owner:** brooks-architect | **group_id:** allura-system
**Implements:** ADR-001 (Tenancy Model), ADR-002 (Team Manifest Contract)
**GitHub org:** https://github.com/Allura-Ecosystem

## What this document is

The source-of-truth definition of **Allura-Ecosystem** as a governed Allura tenant. Everything
else — manifests, repos, agent identities, dashboards — references this charter. It is the thing
ADR-001 said must exist before teams or UI get built.

## The group_id ruling (the decision this setup turns on)

**Allura-Ecosystem operates under `group_id = allura-system`. We do NOT mint `allura-ecosystem`.**

ADR-001 reserves `allura-system` for "platform governance / shared canon." Allura-Ecosystem *is*
the platform — the vendor org that builds and owns the Brain. So its operational tenant and the
shared-canon tier are the same namespace. Three reasons:

1. **No second platform identity.** The Brooks canon and this entire session already write to
   `allura-system`. Minting `allura-ecosystem` would create two competing "home" namespaces for the
   same org — exactly the drift ADR-001 exists to prevent.
2. **Only the platform owns canon.** `allura-system` is the one tenant whose promoted insights are
   readable by every client tenant. The platform org is the sole legitimate writer of that canon, so
   platform-tenant and canon-source coincide cleanly — no other org can write there.
3. **Clients are siblings, not children.** Faith Meats and Difference Driven are not divisions of
   the platform's namespace; they are independent tenants the platform's teams *serve*. Keeping the
   platform on `allura-system` keeps that sibling relationship honest.

> Refinement to ADR-001: `allura-system` is dual-purpose **by design for exactly one org** — the
> platform. For every other org, tenant ≠ canon tier. This is the single documented exception.

## Tenant map

```text
allura-system  (Allura-Ecosystem — platform tenant + shared canon source)
│   native teams (roles): team-ram, team-durham, bahari
│
├── serves ─> allura-faithmeats        (Faith Meats — halal CPG)        team role: team-raleigh
├── serves ─> allura-difference-driven (Difference Driven — nonprofit)  team role: team-charlotte
└── serves ─> allura-mortagate         (Mortgage Audit vertical)        team role: team-penasoto
```

Per ADR-001, a team is a **role**, not a boundary. Team RAM building the platform writes to
`allura-system`; Team RAM building Faith Meats software writes to `allura-faithmeats` with
`metadata.team = "team-ram"`. Same team, different tenant.

## Native teams (roles within allura-system)

| Team | Role | Curator | Primary repos (Allura-Ecosystem org) |
|---|---|---|---|
| **Team RAM** | Software engineering — Brain, runtimes, infra | bahari | allura (core), allura-memory, runtimes |
| **Team Durham** | Brand production — strategy, naming, visual, brand kits | bahari | team-durham |
| **Bahari** | Curation — pattern detection, dedup, quality, evidence validation, HITL review | (self) | allura (curator pipeline) |

> Repo inventory above is the working set; confirm the exact list against the live
> github.com/Allura-Ecosystem org before locking (some repos may still sit under prior accounts).

## Read / write scope (enforced at API/CHECK layer, not convention)

- **Platform teams write** to `allura-system` when building the platform itself.
- **When serving a client**, a platform team writes to that client's tenant
  (`allura-<client>`) tagged with its `metadata.team`, and reads that tenant **plus** `allura-system`.
- **No team ever reads another client's tenant.** That is the isolation guarantee.
- **Promotion** to canon (`allura-system`) happens only via Bahari (HITL) — never autonomous.

## Governance invariants (inherited, non-negotiable)

1. `group_id` on every read/write — pattern `^allura-[a-z0-9-]+$`; missing it is a hard failure.
2. PostgreSQL events are append-only — no UPDATE/DELETE on event/trace rows.
3. Neo4j versioning via SUPERSEDES — `(v2)-[:SUPERSEDES]->(v1)`, never edit nodes.
4. HITL required for promotion — route through the curator (Bahari), not autonomous.
5. DB ops via governed MCP tools only — never `docker exec`.
6. `allura-*` namespace only — flag any non-conforming legacy namespace as drift.

## Provisioning state

- ✅ Charter defined; group_id ruled (`allura-system`).
- ✅ Team manifests authored (see `manifests/`).
- ⏳ Live tenant steps (Postgres schema, Neo4j namespace, CHECK constraints, credentials) — see
  `allura-ecosystem-provisioning-checklist.md`. These require real DB execution and Sabir's hand on
  the trigger; not faked here.

## Open Questions

1. Confirm the live repo inventory under github.com/Allura-Ecosystem.
2. Do Faith Meats / Difference Driven / Mortagate get their own charters now, or after the platform
   tenant is proven?
3. Is Bahari one curator across all tenants, or per-tenant curator instances sharing one policy?
