# Story 1.3: Rewrite Ecosystem README

> Status: blocked-by-1-2
> Epic: Ecosystem Presentation & Documentation Refresh
> Owner: Ogilvy (Team Durham copywriter)
> Estimated: 1-2 hours

## Context

The current `README.md` is 78 lines, no visual identity, no value narrative. It's a table of repos with no story. The allura-memory README (550 lines) is the model — but the ecosystem README needs its own angle: it's the INDEX, the front door, the source-of-truth.

## What the New README Must Do

1. **30-second comprehension:** A recruiter/investor reading for 30 seconds knows what Allura is, why it matters, that it's serious work
2. **Lead with value narrative:** "Memory that shows its work" — not "here's a table of repos"
3. **Center self-improvement as the moat:** The Genesis Engine + curator + SUPERSEDES loop is the differentiator no competitor has
4. **Embed 4 infographics:** value prop, six-layer, self-improvement, receipt
5. **Allura voice:** warm, practical steward; avoid "seamless/scalable/leverage/users"

## README Structure

```markdown
<p align="center">
  <img src="docs/images/allura-wordmark.png" alt="Allura" width="180" />
</p>

<h1 align="center">Memory That Shows Its Work</h1>

<p align="center">
  The governed memory engine for AI agents — self-hosted, auditable, self-improving.
</p>

[nav links]

---

[Infographic 1: Value Prop — "Memory That Shows Its Work"]

## Why Allura?

[The problem: agents forget, and when they "remember" you can't trust it.
Black-box memory silently decides what matters. Allura doesn't.]

[The answer: memory that shows its work. Every memory starts as a trace,
moves through scoring, review, and promotion. Nothing becomes knowledge
without approval. Every memory carries provenance.]

[Before/after table: Without Allura vs With Allura]

---

[Infographic 2: Six-Layer Memory Plan]

## The Six-Layer Memory Plan

[Logs are not knowledge. Six layers, one rule.]

[Brief description of each layer with the rule]

---

[Infographic 3: Self-Improvement Loop]

## The Self-Improvement Loop

[The thing no competitor has. The system gets better at helping agents
by learning from what they do.]

[Curator → Genesis → SUPERSEDES cycle description]

[Industry context: Mem0/Zep/Letta/Cognee/Supermemory all lack governance
and self-improvement. Allura is the only system with both.]

---

[Infographic 4: Memory Receipt]

## The Memory Receipt

[Every memory comes with a receipt. Provenance, version, approval trail.]

---

## The Ecosystem

[Repo map — visual, not just table. 10 repos with role + visibility.]

## Quick Start

[Clone commands]

## Plugin Marketplace

[4 validated plugins]

## Model Governance

[47 agents, 7 models, models.yaml registry]

## Governance

[Six invariant policies, RuVix gate]

## License
```

## 6-Dimension README Rubric (0-10 each)

| Dimension | What "10" looks like |
|---|---|
| Brand Voice | Allura voice: warm, practical steward. Uses community/connection/evidence/provenance. Avoids users/seamless/scalable. Formality 4/10, enthusiasm 6/10. |
| 30-Second Comprehension | Recruiter/investor knows: what Allura is, why it matters, that it's serious work — in 30 seconds |
| Visual Integration | Hero + 4 infographics embedded at right places, alt text, images load, wordmark centered |
| Information Architecture | Clear sections: What → Why → How → Repo map → Quick start. Inverted pyramid. Skimmable. |
| Technical Truthfulness | Every claim true. No "done" without evidence. RuVector cutover reflected. Genesis Engine included. |
| Portfolio Polish | Professional. No typos, no broken links, consistent formatting, GitHub-rendered, mobile-readable. |

**Pass threshold: 7/10 average, no dimension below 5.**

## Acceptance Criteria

- [ ] README leads with "Memory That Shows Its Work" value narrative
- [ ] 4 infographics embedded with alt text
- [ ] Self-improvement loop has its own section (not a footnote)
- [ ] Before/after table (Without Allura vs With Allura) present
- [ ] Industry context referenced (Mem0/Zep/Letta lack governance)
- [ ] Repo map present (10 repos, role + visibility)
- [ ] Quick start, plugin marketplace, model governance, governance sections present
- [ ] Allura voice throughout (no banned phrases)
- [ ] No typos, no broken links, consistent formatting
- [ ] Scores ≥ 7/10 on all 6 dimensions

## Validation

```bash
# Verify no banned phrases
grep -iE "seamless|scalable|leverage|frictionless|users when" README.md
# Should return nothing (except in quoted/before-after context)

# Verify infographics referenced
grep -E "docs/images/infographic-" README.md
# Should return 4 matches

# Verify self-improvement section exists
grep -iE "self.improvement|genesis|curator|supersedes" README.md
# Should return matches

# Verify word count (should be substantial but not bloated)
wc -l README.md
# Target: 200-400 lines (between current 78 and allura-memory's 550)
```

## Notes

- Use `allura-brand` skill for voice compliance
- Use `bmad-agent-tech-writer` (`WD`) skill for the actual writing
- Reference allura-memory/README.md as the quality model
- Blocked by Story 1-2 (infographics must exist before README embeds them)