# Allura Governance Plugin

Enforces `.opencode/policy/*.md` as runtime hooks via the OpenCode plugin system.

## File

- `allura-governance.ts` — the plugin. Loaded automatically by OpenCode from `.opencode/plugins/`.

## Hooks Implemented

| Severity | Hook | What It Catches |
|----------|------|-----------------|
| P0 | `enforce-group-id` | Memory MCP calls without `group_id` or with invalid namespace |
| P0 | `block-db-exec` | `docker exec` into pg/neo4j, direct `psql`/`cypher-shell`, direct port access |
| P0 | `append-only-guard` | SQL `UPDATE`/`DELETE`/`TRUNCATE` on `*_events`/`*_traces`/audit tables |
| P0 | `neo4j-no-mutate-insight` | Cypher `SET`/`DELETE` on `:Insight` nodes |
| P0 | `flag-roninclaw-namespace` | Any `roninclaw-*` in tool args (drift) |
| P2 | `verification-before-done` | Completion claims ("done", "fixed", "passing") in assistant messages |

## Behavior

- **P0 hooks log loudly** with `🛓 BLOCK` prefix. In **advisory mode** (default) they flag violations so the agent and operator see them. In **hard-block mode** they throw a `GovernanceError` to abort the tool call.
- **P2 hooks log softly** with `📋 LOG` prefix. They're reminders, paired with the `verification-before-completion` skill.

## Hard-Block Mode

Set `ALLURA_GOVERNANCE_HARD_BLOCK=1` to make P0 violations throw and abort the offending tool call. Default is advisory (log only) so detection patterns can be validated before enforcement.

```bash
# Advisory (default) — log violations, don't abort
unset ALLURA_GOVERNANCE_HARD_BLOCK

# Hard-block — P0 violations abort the tool call
export ALLURA_GOVERNANCE_HARD_BLOCK=1
```

Enable hard-block once you're confident the detection patterns are tight enough that false positives are rare.

## Event Model

OpenCode emits `message.part.updated` events. Tool calls surface as parts with `type: "tool"` and a `state` object containing `input` (the args) and `output` (the result). We audit those parts.

## Adding Policies

1. Write the policy in `.opencode/policy/<name>.md`
2. Add the matching detection logic in `allura-governance.ts`
3. Update `.opencode/policy/README.md` index
4. Update this file's hooks table

## Source of Truth

The policies in `.opencode/policy/` are the source of truth. This plugin is the enforcement mechanism. If the plugin and a policy disagree, the policy wins — fix the plugin.