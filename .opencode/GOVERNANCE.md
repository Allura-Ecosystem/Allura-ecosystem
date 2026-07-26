# Allura Governance

This directory holds the **enforced** form of the conventions in `AGENTS.md`.

## What's Here

- [`policy/`](./policy/) — markdown policy files. The rules, written for agents and humans to read.
- [`plugins/`](./plugins/) — OpenCode plugin that audits tool calls and flags violations at runtime.
- [`skills/`](./skills/) — Tier-1 skills installed as the operating contract for this repo (symlinked from `~/.agents/skills/`).

## How They Fit Together

```
AGENTS.md  ───────►  .opencode/policy/*.md  ───────►  .opencode/plugins/allura-governance.ts
   │                      │                              │
   │  constraints         │  rules                       │  runtime audit
   │  (source)            │  (citable)                  │  (enforcement)
   ▼                      ▼                              ▼
   agents read            agents cite                    plugin flags violations
```

1. **`AGENTS.md`** states the constraints (source of truth).
2. **`policy/*.md`** turns those constraints into citable, structured rules.
3. **`plugins/allura-governance.ts`** audits tool calls and flags violations at runtime.

## Policy Tiers

- **P0** — non-negotiable. Block on violation. (group_id, append-only, SUPERSEDES, MCP-only, allura-namespace)
- **P1** — governance gates. Warn + require confirmation. (HITL promotion, RuVector boundary)
- **P2** — disciplinary. Warn + log. (logs-not-knowledge, evidence-before-claims)

## Tier-1 Skills (Always-On)

These 13 skills are symlinked into `.opencode/skills/` and form the operating contract:

| Skill | Role |
|------|------|
| `allura-memory-core` | Retrieve-before-plan, write-trace-after-work |
| `allura-team-ram` | Shared governance gates for all `allura-*` wrappers |
| `allura-health-observability` | System status and pipeline health |
| `allura-hydration-integrity` | Graph/semantic/episodic freshness separation |
| `allura-retrieval-drift-audit` | Diagnose search freshness and label drift |
| `allura-promotion-roundtrip` | Verify HITL receipts after promotion |
| `allura-code-review` | Governed code review with Pike/Fowler gates |
| `postgres-best-practices` | Parameterized queries, append-only discipline |
| `security-bluebook-builder` | Threat models and security rules |
| `varlock` | Secrets/env management without exposure |
| `carloss-integrity-audit` | Cross-artifact reconciliation (docs ↔ code ↔ env ↔ DB) |
| `systematic-debugging-memory` | Symptom-before-cause debugging with Brain context |
| `code-review` | Findings-first review with repo guardrails |

## Hierarchy

Per the superpowers `using-superpowers` skill:

1. **User's explicit instructions** (CLAUDE.md, AGENTS.md, direct requests) — highest
2. **These policies** — enforce AGENTS.md constraints
3. **Superpowers skills** — override default behavior
4. **Default system prompt** — lowest

If `AGENTS.md` says X and a policy says Y, `AGENTS.md` wins. These policies are the *enforcement mechanism* for AGENTS.md, not a replacement for it.