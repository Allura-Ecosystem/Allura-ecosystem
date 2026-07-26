# Policy: Append-Only Traces

**Severity:** P0 — block on violation
**Source:** `AGENTS.md` → "Postgres traces are append-only — no UPDATE/DELETE on trace rows, ever."

## Rule

PostgreSQL event/trace tables are **append-only**. No `UPDATE`. No `DELETE`. No `TRUNCATE`. Historical rows are immutable.

This applies to every table in the raw trace store layer (layer 1 of the six-layer architecture):
- `*_events` tables
- `*_traces` tables
- Audit log tables
- Any table whose rows represent agent activity that has already happened

## Why

The first principle of Allura: **logs are not knowledge, but logs are the evidence that knowledge is built from.** If you mutate a historical row, you destroy the audit trail. You make curator proposals unverifiable. You break the six-layer separation.

An agent that says "I fixed a typo in last week's trace" has not fixed anything — they have destroyed evidence.

## Allowed Operations

- `INSERT` — always allowed (append)
- `SELECT` — always allowed (read)
- Schema migrations (DDL) — allowed via governed migration tooling only, never ad-hoc

## Blocked Operations

- `UPDATE` on trace/event/audit tables
- `DELETE` on trace/event/audit tables
- `TRUNCATE` on trace/event/audit tables
- `DROP TABLE` on trace/event/audit tables (see `mcp-only-db-access.md` for the DB-access rule; this policy covers the row-mutation rule)

## Enforcement

- **Hook:** `append-only-guard` (in `.opencode/plugins/allura-governance.ts`) inspects SQL-bearing tool calls for `UPDATE`/`DELETE`/`TRUNCATE` against protected tables.
- **Allowlist:** Migrations may be allowlisted by name in `.opencode/policy/allowlist.json` (to be created when first needed).
- **Agent instruction:** Agents MUST NOT issue UPDATE/DELETE against trace tables. If you need to "correct" a trace, write a new row and let the curator layer propose the correction as an Insight.

## Exceptions

None. If you believe you need to UPDATE a trace row, you are collapsing layers. Stop. Write a new row. Let the curator handle it.