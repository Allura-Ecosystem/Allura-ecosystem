# Allura Ecosystem — Ralph Project Prompt

## Mission

Build the Allura ecosystem: governed agent memory, team harnesses, factory automation, and a custom agent UI shell (replacing Aion UI/Perplexica). Every change must pass Allura governance gates.

## Architecture

- **Brain**: PostgreSQL (episodic, append-only) + Neo4j (semantic, SUPERSEDES) via MCP
- **Team RAM**: 10-agent surgical team (Brooks orchestrates, Woz builds, Pike/Fowler gate)
- **Factory**: BMad + Allura overlay → produces client teams (Penasoto, Raleigh, Charlotte)
- **Governance**: group_id enforcement, append-only, SUPERSEDES, HITL promotion, pol-001–006
- **Methodology**: Ralph loop + Spec-Kit intake + TDDQC quality gate

## Mandatory Rules

1. Every memory operation uses `group_id = "allura-system"`
2. PostgreSQL events are append-only — no UPDATE, no DELETE
3. Neo4j nodes version via SUPERSEDES — never mutate in-place
4. No promotion from episodic to semantic without human curator (HITL) approval
5. Scout hydrates context before any implementation (no blind builds)
6. Fowler gates every commit path: `bun run typecheck && bun run lint` must pass
7. All architectural decisions logged to Brain as `ARCHITECTURE_DECISION` events
8. Notion is source of truth for planning and roster — repo docs are mirrors
9. Factory teams pass `validate.sh` with all 55 governance gates
10. Never hand-edit agent mirrors in `.claude/agents/` — edit `.opencode` source and regenerate

## Success Criteria

Output `<promise>COMPLETE</promise>` when all tasks are done and tests pass.