# Epic: Ecosystem Presentation & Documentation Refresh

> Status: in-progress
> Created: 2026-07-25
> Owner: Brooks (orchestrator) + Team Durham (visual/copy) + BMad tech-writer (docs)

## Problem

The Allura ecosystem repo is the source-of-truth index, but its front door is a tent flap:

- `README.md` is 78 lines, no visual identity, no value narrative
- 4 stale docs (CONSOLIDATION-GOAL/PLAN, LAYOUT, ARCHITECTURE) predate the RuVector cutover (AD-49, 2026-07-12) and the Genesis Engine
- The self-improvement story (curator + Genesis + SUPERSEDES) — the strongest differentiator against Mem0/Zep/Letta — is invisible
- No infographics exist to communicate the six-layer architecture or the value prop
- The Notion dashboard is out of sync with actual repo state

Industry context (Exa research, July 2026): All 5 major AI memory systems (Mem0, Zep, Letta, Cognee, Supermemory) lack enterprise governance. Allura is the only system with HITL promotion, SUPERSEDES versioning, and a Genesis Engine. But none of that is visible from the ecosystem repo.

## Goal

Turn the ecosystem repo from a vibe-coded index into a portfolio-ready front door that communicates:
1. **What Allura is** — governed memory engine, not a chatbot/framework/platform
2. **Why it matters** — agents forget; Allura remembers with evidence
3. **How it's different** — self-improvement loop (curator + Genesis + SUPERSEDES) that no competitor has
4. **What the user sees** — the memory receipt, the six-layer plan, the self-improvement cycle

Portfolio-ready = a recruiter/investor reading the README for 30 seconds understands what Allura is, why it matters, and that it's serious work.

## Scope

### In scope
- Update 4 stale ecosystem docs to reflect RuVector cutover + Genesis Engine
- Generate 4 infographics via fal.ai (brand-baked, vision-scored, near-100% pass)
- Rewrite ecosystem README with value narrative + infographics + Allura voice
- Update Notion dashboard with current status
- Code review all deliverables against rubric
- Retrospective

### Out of scope
- Code changes to allura-memory (that repo's Epic Level 4 is done)
- New features in the brain
- Publishing benchmark numbers (separate decision)
- Photo agent (separate project)

## Stories

| Story | Title | Owner | Status |
|------|-------|-------|--------|
| 1-1 | Update 4 stale ecosystem docs | BMad tech-writer | ready-for-dev |
| 1-2 | Generate 4 infographics via fal.ai | Glaser (Team Durham) | ready-for-dev |
| 1-3 | Rewrite ecosystem README | Ogilvy (Team Durham) | blocked-by-1-2 |
| 1-4 | Update Notion dashboard | Brooks | blocked-by-1-1 |
| 1-5 | Code review all deliverables | Munari (Team Durham) | blocked-by-1-3 |
| 1-6 | Retrospective | Brooks | blocked-by-1-5 |

## Acceptance Criteria

- [ ] 4 ecosystem docs reflect RuVector cutover (AD-49) and Genesis Engine
- [ ] 4 infographics generated, vision-scored ≥ 7/10 on all 5 dimensions
- [ ] README rewritten, scores ≥ 7/10 on all 6 dimensions
- [ ] Notion dashboard updated with current status
- [ ] Munari brand compliance: pass on all artifacts
- [ ] Retrospective completed and logged

## Industry Context (from Exa, July 2026)

| System | Governance | Self-Improvement | Benchmark |
|--------|-----------|-----------------|-----------|
| Mem0 | None | No | 49% (vendor) / 73.8% (reproduced) |
| Zep/Graphiti | None | No | 63.8% |
| Letta | None | Partial (agent self-edits) | varies |
| Cognee | None | No | not published |
| Supermemory | None | No | not published |
| **Allura** | **HITL + SUPERSEDES + audit** | **Genesis Engine + curator** | **not published** |

Allura's moat: governance + self-improvement. The README must make this visible.