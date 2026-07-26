# Story 1.1: Update 4 Stale Ecosystem Docs

> Status: ready-for-dev
> Epic: Ecosystem Presentation & Documentation Refresh
> Owner: BMad tech-writer (via `bmad-agent-tech-writer` skill)
> Estimated: 1-2 hours

## Context

Four ecosystem docs were last updated June 17, 2026 — before the RuVector cutover (AD-49, 2026-07-12) and before the Genesis Engine was built. They describe an outdated architecture.

## What's Stale

| Doc | Last Updated | What's Wrong |
|-----|--------------|--------------|
| `docs/ALLURA-CONSOLIDATION-GOAL.md` | 2026-06-17 | Predates RuVector as graph backend; references Neo4j as primary |
| `docs/ALLURA-CONSOLIDATION-PLAN.md` | 2026-06-17 | Migration plan is done; doc reads as in-progress |
| `docs/ALLURA-LAYOUT.md` | 2026-06-17 | Repo layout changed (new skills, projects/, workspace/) |
| `docs/ARCHITECTURE.md` | 2026-06-17 | Pre-AD-49; no RuVector, no Genesis Engine, no self-improvement loop |

## What Must Be Updated

### `ALLURA-CONSOLIDATION-GOAL.md`
- Update semantic memory description: RuVector (PG) is now production default, Neo4j 5.26 is read-only fallback
- Reference AD-49 cutover (2026-07-12)
- Add Genesis Engine to the goal description (self-improvement is now part of the consolidation goal)

### `ALLURA-CONSOLIDATION-PLAN.md`
- Mark migration steps as DONE where complete
- Update timeline to reflect actual completion
- Note RuVector cutover as the final step

### `ALLURA-LAYOUT.md`
- Add new directories: `projects/`, `workspace/`, `.opencode/policy/`, `.opencode/plugins/`
- Add new skills (13 untracked in `.opencode/skills/`)
- Reference `projects/allura-memory-mcp/DESIGN.md` (photo agent)
- Update repo map to match current README

### `ARCHITECTURE.md`
- Replace Neo4j-as-primary with RuVector-as-primary (AD-49)
- Add the six-layer memory architecture (from AGENTS.md)
- Add the self-improvement loop (curator → Genesis → SUPERSEDES)
- Add the RuVector boundary (RuVector executes, Allura governs)
- Reference `docs/allura/BLUEPRINT.md` as the canonical source

## Acceptance Criteria

- [ ] All 4 docs reflect RuVector as production graph backend (AD-49)
- [ ] All 4 docs reference Genesis Engine where relevant
- [ ] No doc claims Neo4j is the primary graph store
- [ ] No doc claims the migration is in-progress (it's done)
- [ ] LAYOUT.md includes `projects/`, `workspace/`, `.opencode/policy/`
- [ ] ARCHITECTURE.md includes the six-layer architecture and self-improvement loop
- [ ] All docs cross-reference `docs/allura/BLUEPRINT.md` as canonical

## Validation

```bash
# Verify no stale claims remain
grep -riE "neo4j.*primary|migration.*in.progress|in-progress.*migration" docs/ALLURA-*.md docs/ARCHITECTURE.md
# Should return nothing

# Verify RuVector referenced
grep -riE "ruvector|AD-49" docs/ALLURA-*.md docs/ARCHITECTURE.md
# Should return matches in all 4 docs

# Verify Genesis Engine referenced
grep -riE "genesis|self.improvement|pattern.detect" docs/ARCHITECTURE.md
# Should return matches
```

## Notes

- Use `bmad-agent-tech-writer` (`WD`) skill for the actual writing
- Follow Allura voice: warm, practical steward; avoid "seamless/scalable/leverage"
- These are docs, not code — no tests needed, but grep validation above is required