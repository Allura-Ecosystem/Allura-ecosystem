# ADR: Team Manifest Contract — One File is Installer, Package, and Governance Contract

**Status:** Proposed (Brooks, 2026-06-10 — awaiting Sabir sign-off) | **Owner:** brooks-architect | **group_id:** allura-system

## Context

Two PRD promises — "new team in under 15 minutes" and "install teams without code changes" — both
require an artifact the PRD never defines: a declarative **team manifest** that doubles as the
contract between a team and the Brain. This is the werewolf: it looks like a config file and is
actually the load-bearing interface. It must be settled alongside ADR-001 (tenancy), because the
manifest is *where* the org/team/agent model from ADR-001 gets declared.

## Decision

Every team ships a single manifest. It is simultaneously the **plugin installer**, **marketplace
package**, **deployment contract**, and **governance contract**.

```yaml
apiVersion: allura/v1
kind: Team
metadata:
  name: team-raleigh          # becomes metadata.team on every event this team writes
  organization: allura-faithmeats   # the TENANT group_id (ADR-001: org = boundary)
brain:
  read:                       # org tenant + shared canon ONLY — never another org
    - allura-faithmeats
    - allura-system
  write:                      # writes go to the serving tenant only
    - allura-faithmeats
governance:
  curator: bahari             # HITL reviewer for this team's promotions
  promotion: hitl             # never autonomous (canon invariant 4)
agents:
  - sales
  - logistics
  - packaging
  - flavor-rd
ui:
  icon: raleigh
```

### How this binds to ADR-001 (the two ADRs are one decision)

- `metadata.organization` is the **tenant `group_id`** — the only isolation boundary.
- `metadata.name` is the **team role**, stamped as `metadata.team` on every event the team writes.
  It is *not* a `group_id`.
- A team serving a second org ships a second manifest (same `kind`, different `organization`). Same
  team definition, different tenant — exactly the cross-org reuse ADR-001 requires.

### Don't build a second packaging surface (Conway's Law)

The Agent Factory ADR already chose **BMad Builder + the Allura governance overlay** as the
authoring/packaging layer. The team manifest is the *thin declarative front* of that pipeline, not
a competing one:

| Manifest field | Maps to existing surface |
|---|---|
| `metadata.organization` | governance overlay `persistent_facts` group_id substitution (`allura-<client>`) |
| `brain.read` | overlay `activation_steps_prepend` hydration scope |
| `brain.write` + `governance` | overlay `activation_steps_append` / `on_complete` write-back + HITL |
| `agents[]` | BMad module agents (one governance overlay TOML generated per agent) |

So "install a team" = render this manifest into the BMad module + per-agent overlays, provision the
tenant in the Brain (Postgres schema + Neo4j namespace if new), and register the UI tile. No core
code change — the promise the PRD made.

### Install-time validation gates (hard failures)

1. `metadata.organization` matches `^allura-[a-z0-9-]+$` and is a provisioned (or to-be-provisioned) org.
2. `brain.write` contains only the serving org tenant; `brain.read` contains only that tenant + `allura-system`.
3. `governance.promotion == hitl` and `governance.curator` is set.
4. Every entry in `agents[]` receives the governance overlay (group_id pinned, append-only, HITL, user_id).
5. No team is installed with a team name used as a `group_id` anywhere (ADR-001 enforcement).

## Consequences

- **Gain:** one artifact to author, review, version, and audit; teams become configuration, not
  engineering; the marketplace ships manifests, not code.
- **Give up:** expressiveness — anything the manifest can't declare must go through a real BMad
  skill folder, not a manifest hack. That boundary is deliberate.

## Risks

| Risk | Mitigation |
|---|---|
| Manifest drifts from BMad's schema | Manifest is versioned (`apiVersion: allura/v1`); renderer validates against both schemas; pin BMad version |
| `brain.read`/`write` hand-edited to over-scope | Install gate #2 rejects; server-side credentials scoped to the tenant regardless |
| Team name collides with a `group_id` | Install gate #5; CHECK constraint from ADR-001 |

## Open Questions

1. Manifest distribution: BMad Marketplace, an Allura registry, or both? (carried from Factory ADR)
2. Does provisioning a brand-new org happen inside team install, or as a separate explicit step?
3. Is `metadata.team` validated as an enum per org, or left free-form? (shared with ADR-001 Q2)
