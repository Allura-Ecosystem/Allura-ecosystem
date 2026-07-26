# Story 1.5: Code Review All Deliverables

> Status: blocked-by-1-3
> Epic: Ecosystem Presentation & Documentation Refresh
> Owner: Munari (Team Durham QA reviewer)
> Estimated: 1 hour

## Context

All deliverables from stories 1-1 through 1-4 need a brand compliance + rubric review before the epic is called done. Munari runs the `allura-brand` compliance checklist and the scoring rubrics defined in the epic.

## What to Review

### Story 1-1: 4 Stale Docs
- [ ] All 4 docs reflect RuVector as production graph backend (AD-49)
- [ ] All 4 docs reference Genesis Engine where relevant
- [ ] No doc claims Neo4j is the primary graph store
- [ ] No doc claims the migration is in-progress
- [ ] LAYOUT.md includes `projects/`, `workspace/`, `.opencode/policy/`
- [ ] ARCHITECTURE.md includes six-layer architecture and self-improvement loop
- [ ] All docs cross-reference `docs/allura/BLUEPRINT.md` as canonical
- [ ] Allura voice throughout (no banned phrases)

### Story 1-2: 4 Infographics
- [ ] 4 PNG files exist in `docs/images/`
- [ ] Each image vision-scored ≥ 7/10 on all 5 dimensions
- [ ] No image contains a generated logo or wordmark (except Infographic 1 center divider)
- [ ] All images use Allura palette (cream/charcoal/blue/orange/gold)
- [ ] No purple AI gradients, no cyberpunk aesthetic
- [ ] Each image communicates its one-sentence message in 30 seconds

### Story 1-3: README
- [ ] README leads with "Memory That Shows Its Work" value narrative
- [ ] 4 infographics embedded with alt text
- [ ] Self-improvement loop has its own section
- [ ] Before/after table present
- [ ] Industry context referenced
- [ ] Repo map present (10 repos)
- [ ] Allura voice throughout (no banned phrases)
- [ ] No typos, no broken links, consistent formatting
- [ ] Scores ≥ 7/10 on all 6 dimensions

### Story 1-4: Notion Dashboard
- [ ] "In Progress" section includes Ecosystem Presentation epic
- [ ] "Current Tasks" section includes stories 1-1 through 1-6
- [ ] "Skills" section includes 14 new skills
- [ ] "Frameworks" section includes six-layer, RuVector boundary, self-improvement loop, BMad
- [ ] Allura_Memory marked Epic Level 4 DONE

## Brand Compliance Checklist (from allura-brand skill)

```
✅ Real Allura asset used (wordmark from public/readme/allura-wordmark.png)
✅ No generated logos or logo-like marks
✅ Copy uses Allura voice, avoids banned phrases
✅ Colors/tokens trace back to BLUEPRINT.md §0 or approved assets
✅ README visuals show evidence/provenance/governance, not fake metrics
✅ Any claim of live/healthy/done has proof
✅ Accessibility: contrast, keyboard reachability, readable labels
✅ Degraded/unknown states visible when data absent
✅ Project scope respected
```

## Scoring Rubrics

### Infographic Rubric (5 dimensions, 0-10 each)
1. Philosophy Consistency
2. Visual Hierarchy
3. Detail Execution
4. Functionality
5. Innovation

**Pass: 7/10 average, no dimension below 5.**

### README Rubric (6 dimensions, 0-10 each)
1. Brand Voice
2. 30-Second Comprehension
3. Visual Integration
4. Information Architecture
5. Technical Truthfulness
6. Portfolio Polish

**Pass: 7/10 average, no dimension below 5.**

## Output: Review Report

```markdown
# Code Review: Ecosystem Presentation & Documentation Refresh

## Summary
- Overall: pass / partial / fail
- Docs (1-1): pass / partial / fail — [score]
- Infographics (1-2): pass / partial / fail — [scores per image]
- README (1-3): pass / partial / fail — [score]
- Notion (1-4): pass / partial / fail

## Brand Compliance
- [checklist results]

## Rubric Scores
- [infographic scores]
- [README scores]

## Issues Found
- [list of issues with severity: blocker / major / minor]

## Required Fixes
- [list of fixes before epic can be called done]
```

## Acceptance Criteria

- [ ] Review report produced
- [ ] All deliverables scored against rubrics
- [ ] Brand compliance checklist run
- [ ] Issues categorized (blocker/major/minor)
- [ ] Required fixes documented
- [ ] Overall verdict: pass / partial / fail

## Notes

- Use `allura-brand` skill for brand compliance
- Use `bmad-code-review` skill for the review framework
- Use `allura-code-review` skill for Allura-governed review
- Blocked by Story 1-3 (all deliverables must exist before review)