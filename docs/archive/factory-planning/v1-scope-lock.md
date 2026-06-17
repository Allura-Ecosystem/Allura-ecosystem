# Allura App v1 — Scope Lock

**Decision date:** 2026-06-10
**Decision owner:** Sabir Asheed (brooks-architect)
**Status:** LOCKED

## v1 Definition of Done

The dashboard renders the **governed receipt loop** from live Brain MCP endpoints — nothing else ships in v1.

The loop: a trace arrives → a proposal enters the curator queue → an approval happens → the insight appears in Neo4j → a retrieval cites it.

### v1 surfaces (must work end-to-end against live Brain)

| Surface | Brain tools required | Current status |
|---|---|---|
| Memory Search | `memory_list`, `memory_search` | **Live** — already wired |
| Activity Log | `audit_query_events` | Wrong name check (`audit_search`/`audit_list`) — fix 2 strings |
| Governance | `governance_list_policies`, `governance_check_gate` | Wrong name check (`governance_status`) — fix 1 string + wire 2 calls |
| Curator Panel | `memory_list` (read), needs `curator_approve` action | Read is live, write is blocked (no approve tool yet) |
| Mission Control | `audit_health_report`, `tools/list` | Health probe is mocked — wire 1 call |
| Governance Audit Trail | `governance_audit_log` | Not wired — add 1 call |

### v1 wiring work (complete list)

1. Fix `governance_status` → `governance_list_policies` in `fetchBrainStatus()` tool-name check
2. Fix `audit_search`/`audit_list` → `audit_query_events` in `fetchBrainStatus()` tool-name check
3. Wire `governance_list_policies` into the Governance surface (replace static "Needs wiring" display)
4. Wire `governance_check_gate` into the gate validation panel
5. Wire `audit_query_events` into Activity Log (replace the `memory_list` → `mapBrainEvent` hack)
6. Wire `audit_health_report` into Mission Control health panel (replace the `tools/list` only probe)
7. Wire `governance_audit_log` into the governance event trail section
8. Curator approve: display-only until a `curator_approve` tool is added to the Brain MCP

### Explicitly NOT in v1

- Kanban board
- Chat runtime (Anthropic API streaming)
- Dreams / scheduled tasks UI
- Settings persistence
- Agent registration health checks
- Dark mode / command palette / motion polish
- Custom agent discovery (.well-known/agent.json)

These are v2 epics. They do not block v1 ship.

## Architecture decision: strangler pattern, not rebuild

The current codebase (`allura-app/`) stays. The mock-brain test harness stays. The nginx `/brain/mcp` proxy stays.

Replace mock responses with real Brain calls endpoint-by-endpoint. The mock-brain.ts in the test harness remains for unit tests — it is an asset, not the problem.

**Rationale:** Three dashboard rebuilds have stalled at the same wall (live data). The current shell is well-built (single-file React, Vite, design tokens, DoD test harness, smoke runner). Throwing it away would be restart #4.

## Supersedes

- Engine-repo dashboard (sunset per Notion decision)
- Brand-maker UX Board attempt
- Any prior scope definition for Epic 10 that includes Kanban, Chat, Dreams, or Settings as v1
