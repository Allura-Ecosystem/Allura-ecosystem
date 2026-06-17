# Goal Definition — Allura Team Platform (MVP)

**Status:** Proposed (Brooks, 2026-06-10 — awaiting Sabir sign-off) | **Owner:** brooks-architect | **group_id:** allura-system
**Related:** ADR-001 (Tenancy Model), ADR-002 (Team Manifest), ADR-003 (RuVector boundary, future)

## Goal

Build the Allura Team Platform where organizations install governed AI teams that share a common,
auditable memory system.

## Outcome

A new team installs from a manifest and immediately participates in the full loop:
**memory event -> proposal -> approval -> retrieval.**

## Success Criteria

- Organization isolation enforced (per-org `group_id`, ADR-001).
- Team manifests install successfully (ADR-002).
- Bahari governance (HITL curator) works end to end.
- Team RAM proves the complete loop on real work.
- Future teams require *configuration* (a manifest), not code.

## Definition of Done

- ADR-001 approved.
- ADR-002 approved.
- Team RAM vertical slice operational.
- Manifest loader implemented.
- Governance loop validated (proposal -> human approval -> promotion).
- Retrieval working through promoted knowledge.

## Revised MVP — One Vertical Slice, Not Five Workspaces

The PRD's Phase-1 lists five full team workspaces at once. That is the second-system trap. Build
**one** team end-to-end first and prove the receipt loop is real:

```text
Team RAM
   |
   v
Memory Event   (append-only trace, group_id = serving org, metadata.team = team-ram)
   |
   v
Proposal       (curator pipeline emits a candidate)
   |
   v
Bahari Review  (HITL gate)
   |
   v
Promotion      (approved -> Neo4j insight, SUPERSEDES on evolution)
   |
   v
Retrieval      (a later agent queries and gets the approved insight)
```

**Loop acceptance test:** an agent writes a memory; a proposal is generated; Bahari reviews; a human
approves; the insight is promoted; a future retrieval finds and uses it. Every step logged,
auditable, reversible.

### Once the loop holds, the other teams are configuration

```text
Team Raleigh  = configuration  (manifest)
Team Charlotte = configuration (manifest)
Team Penasoto  = configuration (manifest)
Future teams   = configuration (manifest)
```

Not engineering projects. Dashboards, the office UI metaphor, the agent marketplace, and RuVector
upstreaming all become layers on top of a *settled* model — not moving targets built in parallel
with it.

## Sequencing (P0 first)

1. **P0** — Ratify ADR-001 (tenancy). Nothing downstream is safe until the boundary is locked.
2. **P1** — Ratify ADR-002 (manifest) + implement the manifest loader.
3. **P1** — Stand up the Team RAM vertical slice and pass the loop acceptance test.
4. **P2** — Replicate one more team (Raleigh) purely via manifest to prove "config, not code."
5. **Later** — UI/office metaphor, dashboards, marketplace, ADR-003 RuVector.
