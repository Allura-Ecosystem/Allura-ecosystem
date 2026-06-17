# ADR: Allura Agent Factory — BMad Builder as the Authoring Layer

**Status:** Decided (Sabir, 2026-06-10) | **Owner:** brooks-architect | **group_id:** allura-system

## Decision

Allura will use **BMad Builder** (bmad-code-org/bmad-builder, Agent Skills open standard) as the
authoring/packaging layer for building agents and workflows for clients. Allura's value-add is the
**governance overlay**: every generated agent ships Brain-connected, tenant-isolated, and auditable.

**Division of responsibility (conceptual integrity):**

| Layer | Owner | Does |
|---|---|---|
| Authoring & packaging | BMad Builder | Module scaffolding, agent/workflow definitions, validation, marketplace distribution, 40+ runtime compatibility |
| Governance & memory | Allura Brain | group_id tenancy, append-only traces, HITL promotion, SUPERSEDES versioning, retrieval, audit receipts |
| Delivery | Allura (us) | Intake → build → overlay → validate → deliver pipeline per client |

We do NOT fork BMad. We inject through its supported customization surface, which survives updates.

## Why this works (the mapping)

BMad's three-layer TOML override model (`customize.toml` defaults → `_bmad/custom/<skill>.toml`
team → `<skill>.user.toml` personal) provides exactly the hooks the Brooks protocol needs:

| BMad surface | Allura governance use |
|---|---|
| `activation_steps_prepend` | Brain hydration BEFORE greeting (Scout/Tier-1 pattern) |
| `persistent_facts` | Pin tenant invariants in context: group_id, append-only, HITL, MCP-only |
| `activation_steps_append` | Log AGENT_INVOKED / session_start event |
| `on_complete` (workflows) | Outcome write-back + receipt |
| `[[agent.menu]]` merge-by-code | Add governed commands (e.g., exit-with-validation) |
| Central `_bmad/custom/config.toml` `[agents.<code>]` | Client roster, team-scoped, committed |

Overrides are sparse and update-safe — BMad releases never clobber the governance layer.
Limit: `agent.name`/`agent.title` are read-only; renaming requires shipping a custom skill folder.

## The Allura Governance Overlay (template v0.1)

Drop into any BMad-built client project as `_bmad/custom/<skill-name>.toml`, substituting the
tenant id. This is the productized artifact — one file pattern, every client agent governed.

```toml
# Allura Governance Overlay — tenant: allura-<client>
[agent]

persistent_facts = [
  "GOVERNANCE: every memory/DB operation MUST include group_id = 'allura-<client>' (pattern ^allura-[a-z0-9-]+$); missing group_id is a hard failure.",
  "GOVERNANCE: event/trace stores are append-only — never UPDATE or DELETE; corrections are new entries with rationale.",
  "GOVERNANCE: knowledge versioning uses SUPERSEDES links — never edit existing knowledge in place.",
  "GOVERNANCE: promotion to canonical knowledge requires human approval (HITL) — propose, never self-promote.",
  "GOVERNANCE: memory is context, not proof — 'done' claims require an artifact or event receipt.",
  "IDENTITY: use user_id = '<agent-code>' on all Allura Brain operations.",
]

activation_steps_prepend = [
  "Call allura-brain_memory_search({ query: 'current blockers recent decisions', group_id: 'allura-<client>', limit: 10 }) and hold the results as session context. If Brain tools are unavailable, state 'Brain hydration unavailable' plainly and continue without fabricating memory.",
]

activation_steps_append = [
  "Call allura-brain_memory_add({ group_id: 'allura-<client>', user_id: '<agent-code>', content: 'Session started.', metadata: { source: 'conversation', agent_id: '<agent-code>', event_type: 'session_start' } }).",
]

[[agent.menu]]
code = "DA"
description = "Exit with Allura validation (logs TASK_COMPLETE outcome to the Brain before deactivating)"
prompt = """
Before exiting: write allura-brain_memory_add with group_id 'allura-<client>',
user_id '<agent-code>', content summarizing what was done, found, and what to watch for,
metadata.event_type 'TASK_COMPLETE'. If the write fails, tell the user plainly and do not
claim a clean exit.
"""
```

Workflow variant: same facts under `[workflow]`, plus
`on_complete = "Write the outcome to Allura Brain (group_id allura-<client>) and summarize the receipt id to the user."`

## Factory Pipeline (target)

1. **Intake** — client need captured (Team RAM intake / Kotler Phase 0 style).
2. **Build** — bmad-builder scaffolds the module (agents, workflows, module.yaml).
3. **Overlay** — Allura governance TOMLs generated per agent with the client's `allura-<tenant>` id.
4. **Validate** — bmad-builder validator (Agent Skills compliance) + Allura gates (group_id present, no secrets, overlay applied to every agent).
5. **Deliver** — package to marketplace / direct install; tenant provisioned in Brain (Postgres schema + Neo4j namespace).
6. **Operate** — agents log to their tenant; curator proposes; client approves; Allura dashboards audit.

## Monorepo placement

`Allura-Ecosystem/allura` gains a `factory/` directory: overlay templates, tenant provisioning
scripts, validation gates. BMad Builder itself stays an external dependency (npm `bmad-builder`),
not vendored — Brooksian boundary: depend on the interface (customize.toml + Agent Skills
standard), not the implementation.

## Risks

| Risk | Mitigation |
|---|---|
| BMad changes its customization schema | Baseline fields (`activation_steps_*`, `persistent_facts`, `on_complete`) are documented as stable; pin bmad-builder versions per client; validation gate catches drift |
| Overlay is advisory (prompt-level), not kernel-enforced | True enforcement stays in the Brain API layer (group_id CHECK constraints, append-only schema) — the overlay is defense-in-depth, not the wall |
| Client edits/removes the overlay | Tenant credentials are scoped server-side; an agent without the overlay still can't violate tenancy at the API |
| Python 3.11+ required for BMad resolver | Note in client onboarding checklist (Ubuntu 22.04 ships 3.10) |

## Open Questions

1. Productize the overlay generator as a Durham/RAM skill or a standalone `allura-factory` plugin?
2. Marketplace strategy: BMad Marketplace, own registry, or both?
3. Tenant provisioning automation — script vs. dashboard surface?
