# Policy: allura-* Namespace Only

**Severity:** P0 — block on violation
**Source:** `AGENTS.md` → "`allura-*` namespace only — flag any `roninclaw-*` as drift."

## Rule

All identifiers in this ecosystem MUST use the `allura-*` namespace. The legacy `roninclaw-*` namespace is drift and MUST be flagged, not silently accepted.

This applies to:
- `group_id` values (see `group_id-required.md`)
- File paths and directory names
- Environment variable prefixes
- MCP tool names
- Service names and container names
- Database schema/table prefixes

## Why

The repo has a history. Legacy namespaces are how old state hides from new governance. A `roninclaw-*` identifier means: this was created before the rules, and it has not been migrated.

Silently accepting `roninclaw-*` means the old namespace lives on. Flagging it forces a decision: migrate, or explicitly carve out a legacy exception.

## Enforcement

- **Hook:** `flag-roninclaw-namespace` (in `.opencode/plugins/allura-governance.ts`) scans file paths, env vars, and tool-call arguments for `roninclaw-*` and warns.
- **Agent instruction:** If you see `roninclaw-*` in a path, env var, group_id, or tool name, STOP. Flag it as drift. Do not write new code that references it. Propose migration to `allura-*`.

## Migration

When you encounter `roninclaw-*`:

1. Flag it in your output: `⚠️ DRIFT: found roninclaw-* at <location>`
2. Propose the `allura-*` replacement
3. Do not proceed with the legacy namespace unless explicitly instructed by the user
4. Log the drift instance to Brain (with `group_id: "allura-system"`) so the pattern is tracked

## Examples

| Drift | Migration |
|-------|-----------|
| `roninclaw-default` (group_id) | `allura-system` |
| `roninclaw-memory` (service) | `allura-memory` |
| `RONINCLAW_DB_URL` (env) | `ALLURA_DB_URL` |
| `/roninclaw/...` (path) | `/allura/...` |