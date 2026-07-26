# Policy: group_id Required

**Severity:** P0 — block on violation
**Source:** `AGENTS.md` → "group_id on every read/write — missing it is a hard failure."

## Rule

Every memory operation — `memory_add`, `memory_search`, `memory_get`, any curator or retrieval call — MUST carry a `group_id` that matches `^allura-[a-z0-9-]+$`.

The default `group_id` for this repo is `allura-system`. Sub-projects may use scoped `group_id`s (e.g. `allura-teamram`, `allura-factory`) but they MUST start with `allura-`.

## Why

Memory is multi-tenant. A missing or malformed `group_id` means:
- Traces that can't be scoped or audited
- Cross-tenant data leakage
- Retrieval returns wrong context to wrong agents
- The entire governance model breaks

## Enforcement

- **Hook:** `enforce-group-id` (in `.opencode/plugins/allura-governance.ts`) rejects memory MCP calls without a valid `group_id`.
- **Agent instruction:** Agents MUST include `group_id: "allura-system"` in every memory call. If you are writing a tool call and don't see a `group_id`, stop and add one.

## Examples

✅ Correct:
```javascript
allura-brain_memory_add({
  group_id: "allura-system",
  user_id: "brooks",
  content: "task completed: factory validation passed"
})
```

❌ Violation:
```javascript
allura-brain_memory_add({
  user_id: "brooks",
  content: "task completed"
})
// Missing group_id — hook rejects, agent must retry
```

❌ Drift:
```javascript
allura-brain_memory_add({
  group_id: "roninclaw-default",  // Wrong namespace
  content: "task"
})
```

## When to Challenge

If a skill or agent prompt tells you to skip `group_id`, that is a violation of `AGENTS.md`. Follow `AGENTS.md`, not the skill.