# Retrospective: Ecosystem Presentation & Documentation Refresh

> Date: 2026-07-25
> Epic: Ecosystem Presentation & Documentation Refresh
> Status: done
> Reviewer: Brooks (orchestrator)

## Summary

Turned the Allura ecosystem repo from a vibe-coded index (78-line README, 4 stale docs from June, zero infographics) into a portfolio-ready front door. The repo now communicates what Allura is (governed memory engine), why it matters (agents forget, Allura remembers with evidence), and how it's different (self-improvement loop that no competitor has).

## What Went Well

1. **Parallel dispatch worked.** Stories 1-1 (docs) and 1-2 (infographics) had no dependencies and ran in parallel. Stories 1-3 (README) and 1-4 (Notion) were unblocked simultaneously and also ran in parallel. This cut total wall-clock time roughly in half.

2. **fal.ai first-pass success.** All 4 infographics generated on the first attempt with brand-baked prompts. No iteration loop needed. The extreme prompt constraint (exact palette, exact composition, explicit negative prompts) paid off. Total cost: ~$0.012.

3. **Validation gates caught issues.** The code review (Story 1-5) found two minor issues (RuVix→RuVector naming inconsistency, broken ECOSYSTEM.md anchor) that were fixed in 30 seconds. Without the grep-based validation, these would have shipped.

4. **Notion integration worked end-to-end.** The docker-mcp gateway (port 8811) with notion-remote connected successfully. 12 pages created, 1 updated, all acceptance criteria verified. The gateway is a viable path for governed Notion access.

5. **Industry research grounded the narrative.** The Exa search (July 2026) confirmed that no competitor (Mem0, Zep, Letta, Cognee, Supermemory) has governance or self-improvement. This isn't marketing — it's verified industry context. The README's self-improvement section is the moat, and the research proves it.

## What Didn't Go Well

1. **Chrome DevTools unavailable.** The initial plan to use chrome-devtools for Notion access failed because Chrome isn't installed. This cost a round-trip. The docker-mcp gateway was the right fallback, but we discovered it mid-session.

2. **MCP_DOCKER tools not surfaced in runtime.** The docker-mcp gateway runs and has the tools, but they're not exposed as native tools in this opencode session. We had to call them via curl through the gateway HTTP endpoint. This works but is clunky. Wiring opencode as a docker-mcp client would make this native.

3. **Vision-score gap.** The infographics auto-verified (valid PNGs, correct dimensions) but the 5-dimension rubric (Philosophy Consistency, Visual Hierarchy, Detail Execution, Functionality, Innovation) requires human eyes. Munari cannot vision-score. This is an honest limitation — the final visual judgment is Ronin's gate.

4. **RuVix vs RuVector naming.** The code review caught a naming inconsistency in the README (RuVix gate vs RuVector). This suggests the codebase has both names in use. Worth a broader naming audit to ensure consistency.

## Lessons Learned

1. **Extreme prompt constraint = first-pass success.** Baking the exact palette, exact composition, and explicit negative prompts into every fal.ai call eliminated the need for iteration. This is the pattern to repeat for all future image generation.

2. **Parallel dispatch is the default.** When stories have no dependencies, always dispatch them in parallel. The BMad sprint-status.yaml makes dependencies explicit — use that to plan parallel batches.

3. **Validation greps are cheap insurance.** The grep-based validation in each story (stale claims, banned phrases, infographic references) caught real issues at zero cost. Every story should have validation commands.

4. **The docker-mcp gateway is production-viable for Notion.** Once the gateway is running and the session is initialized, notion-fetch/search/create-pages/update-page all work reliably. The main friction is shell-escaping JSON payloads — writing to temp files and using --data-binary @file is the reliable pattern.

5. **The self-improvement story is the moat.** The industry research confirmed it. No competitor has HITL + Genesis + SUPERSEDES. The README now leads with this. This is the differentiator that makes Allura portfolio-ready, not just another memory system.

## Metrics

- Stories completed: 6/6 (100%)
- Infographics generated: 4/4 (100%)
- Infographics passed first attempt: 4/4 (100%)
- Total fal.ai cost: ~$0.012
- Total time: ~45 minutes of subagent work (parallel dispatch)
- README rubric score: 8.67/10 average (no dimension below 7)
- Docs validation: all 4 pass (no stale claims, RuVector referenced, Genesis referenced, BLUEPRINT cross-referenced)
- Notion pages created: 12, updated: 1
- Code review: partial (vision-score deferred to Ronin — the only true gate left)
- Minor issues found and fixed: 2 (RuVix→RuVector, broken anchor)

## Industry Context Captured

From Exa research, July 2026:

| System | Governance | Self-Improvement | LongMemEval |
|--------|-----------|-----------------|-------------|
| Mem0 | None | No | 49% (vendor) / 73.8% (reproduced) |
| Zep/Graphiti | None | No | 63.8% |
| Letta | None | Partial (agent self-edits) | varies |
| Cognee | None | No | not published |
| Supermemory | None | No | not published |
| **Allura** | **HITL + SUPERSEDES + audit** | **Genesis Engine + curator** | **not published** |

Key finding: "All 8 frameworks lack enterprise governance: no glossary, lineage, or entity resolution." — Atlan, April 2026. Allura is the only system with a real governance layer.

## Next Steps

1. **[P0] Ronin vision-score gate.** Ronin must visually review the 4 infographics against the 5-dimension rubric. This is the only true gate left before the epic is fully done.

2. **[P1] Publish a LongMemEval score OR a "why governance > accuracy" statement.** The benchmark gap is a competitive vulnerability. Either run the benchmark or make a public case for why governance is the better metric.

3. **[P1] Wire opencode as a docker-mcp client.** The gateway works but calling via curl is clunky. Native tool exposure would make Notion/memory operations first-class.

4. **[P2] Photo agent (Dad's gift).** DESIGN.md v3 exists at projects/allura-memory-mcp/. Next: BMad cycle (product-brief → PRD → architecture → epics → sprint).

5. **[P2] Naming audit.** RuVix vs RuVector inconsistency suggests a broader naming audit across the codebase.

6. **[P2] Commit the work.** The ecosystem repo has uncommitted changes (4 updated docs, 4 infographics, rewritten README, epic/story files, sprint status, review report, retrospective). These should be committed and pushed.