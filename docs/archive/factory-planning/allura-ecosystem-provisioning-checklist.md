# Allura-Ecosystem — Tenant Provisioning Checklist

**Status:** Proposed (Brooks, 2026-06-10) | **Owner:** brooks-architect | **group_id:** allura-system
**Companion to:** allura-ecosystem-org-charter.md

These are the steps that make the tenant *real*. They touch the database and credentials, so they
run through governed MCP tools (invariant 5: never `docker exec`) and want your hand on the trigger.
I have NOT executed them — this is the runbook, not a claim they're done.

## 0. Pre-flight

- [ ] Brain healthy (Postgres + Neo4j green) — `audit_health_report({ group_id: "allura-system" })`.
- [ ] Confirm `allura-system` is already the active platform namespace (it is, per this session's
      writes) — so for the platform org this is a *formalization*, not a fresh mint.

## 1. Namespace + constraints (the isolation wall)

- [ ] Verify the `group_id` CHECK constraint enforces `^allura-[a-z0-9-]+$` on every events/trace
      table. This is what makes tenant isolation real rather than convention.
- [ ] Confirm append-only enforcement on event/trace rows (no UPDATE/DELETE path).
- [ ] Confirm Neo4j SUPERSEDES versioning is the only mutation path for insights.

## 2. Register the org

- [ ] Log the `ORG_PROVISIONED` event for Allura-Ecosystem (done this session — receipt in Brain,
      pending curator review).
- [ ] Record the charter as the org's source-of-truth reference.

## 3. Install the native teams (via the manifest loader)

Per ADR-002, "install a team" = render each manifest into BMad module + per-agent governance
overlays, then register. Manifests are authored under `manifests/`:

- [ ] `team-ram.team.yaml`
- [ ] `team-durham.team.yaml`
- [ ] `bahari.team.yaml`

For each: validate against the 5 ADR-002 install gates (group_id matches `^allura-`; write scope =
serving tenant only; `promotion: hitl` + curator set; every agent gets the overlay; no team name
used as a group_id). **The manifest loader itself is not built yet** — it is the next engineering
story (see Team Platform goal doc). Until then, manifests are declarative truth, not executable.

## 4. Sibling client tenants (later, explicit)

Not part of platform setup. When ready, each gets its own charter + provisioning run:

- [ ] `allura-faithmeats` (Team Raleigh)
- [ ] `allura-difference-driven` (Team Charlotte)
- [ ] `allura-mortagate` (Team Penasoto / mortgage audit)

## 5. Verification (definition of done for this provisioning)

- [ ] A write tagged `group_id: allura-system, metadata.team: team-ram` lands and is retrievable.
- [ ] A write with a non-conforming group_id is **rejected** (proves the wall).
- [ ] A proposal routes to Bahari and cannot self-promote (proves HITL).
- [ ] `audit_health_report` still green after the above.

## What needs a human / live execution

- Building the **manifest loader** (engineering story — Team RAM).
- Running any **schema/constraint** changes against the live DB through governed MCP tools.
- **Credential scoping** per tenant (server-side) — out of band from this repo.
