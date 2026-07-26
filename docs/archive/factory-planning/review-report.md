# Code Review: Ecosystem Presentation & Documentation Refresh

> Date: 2026-07-25
> Reviewer: Munari (Team Durham QA)
> Status: **partial** — docs/README/Notion pass; infographic vision-score deferred to Ronin (out of Munari's auto-verification reach); one minor broken-anchor issue in README

## Summary

| Story | Verdict | Score / Note |
|---|---|---|
| **1-1 Stale Docs** | ✅ pass | All 4 docs reflect RuVector + Genesis, no stale claims, BLUEPRINT cross-refs present, no banned phrases |
| **1-2 Infographics** | ⚠️ partial | Auto-verification passed (4 valid PNGs, 1024×768, 246KB–1.0MB). **Vision-score deferred to Ronin** — Munari cannot see images, so the 5-dimension rubric (Philosophy / Hierarchy / Detail / Functionality / Innovation) cannot be auto-applied. Ronin must do the final visual judgment. |
| **1-3 README** | ✅ pass | 6-dimension average **8.67/10**, no dimension below 7. One minor broken-anchor issue (`./ECOSYSTEM.md#governance`). |
| **1-4 Notion Dashboard** | ✅ pass | All 5 acceptance criteria verified live via Notion MCP — epic in-progress, 6 story pages exist, 15 skills added (≥14 required), 4 frameworks added, Allura_Memory Epic L4 marked Done |
| **Overall** | ⚠️ **partial** | Epic is shippable. One blocker for "epic done" tag: Ronin must run the 5-dimension vision-score on the 4 infographics. |

---

## Brand Compliance

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Real Allura asset used (wordmark) | ✅ | `docs/images/allura-wordmark.png` — PNG 1583×1024 RGBA, 173KB, dated 2026-06-14 (real asset, not generated) |
| 2 | No generated logos or logo-like marks | ✅ | README uses only the wordmark + 4 infographics; no AI logos introduced |
| 3 | Copy uses Allura voice, avoids banned phrases | ✅ | `grep -iE "seamless\|scalable\|leverage\|frictionless"` returns 0 matches across `README.md`, `docs/ALLURA-*.md`, `docs/ARCHITECTURE.md` |
| 4 | Colors/tokens trace back to BLUEPRINT.md §0 | ⚠️ | Cannot auto-verify color tokens inside PNGs — deferred to Ronin's vision check |
| 5 | README visuals show evidence/provenance/governance | ✅ | Self-improvement loop, SUPERSEDES, receipt, HITL gate all present; no fake metrics |
| 6 | Any claim of live/healthy/done has proof | ✅ | "Allura_Memory — Epic Level 4: Pattern Learning & Self-Evolution" marked **Done** in Notion with summary text explaining what was delivered |
| 7 | Accessibility: contrast, keyboard reachability, readable labels | ✅ for README (text); ⚠️ for infographics — deferred to Ronin |
| 8 | Degraded/unknown states visible when data absent | ✅ | RuVector-as-primary with Neo4j-as-read-only-fallback language is explicit (AD-49) — not hidden |
| 9 | Project scope respected | ✅ | Only docs/README/Notion touched; no code schema or agent definitions changed |

---

## Rubric Scores

### Infographics (Story 1-2) — vision-score deferred to Ronin

**Auto-verification (passed):**

| File | Type | Dimensions | Size |
|---|---|---|---|
| `docs/images/infographic-value-prop.png` | PNG, 8-bit RGB, non-interlaced | 1024 × 768 | 252 KB |
| `docs/images/infographic-six-layer.png` | PNG, 8-bit RGB, non-interlaced | 1024 × 768 | 354 KB |
| `docs/images/infographic-self-improvement.png` | PNG, 8-bit RGB, non-interlaced | 1024 × 768 | 411 KB |
| `docs/images/infographic-memory-receipt.png` | PNG, 8-bit RGB, non-interlaced | 1024 × 768 | 1.0 MB |

All 4 files exist, are valid PNGs, expected dimensions, reasonable sizes (no 0-byte, no absurdly large). ✅

**5-dimension rubric — Ronin must score these:**

| Dimension | Value-prop | Six-layer | Self-improvement | Memory-receipt |
|---|---|---|---|---|
| 1. Philosophy Consistency | ? | ? | ? | ? |
| 2. Visual Hierarchy | ? | ? | ? | ? |
| 3. Detail Execution | ? | ? | ? | ? |
| 4. Functionality | ? | ? | ? | ? |
| 5. Innovation | ? | ? | ? | ? |

Pass threshold: 7/10 average, no dimension below 5. **Ronin: please open the 4 PNGs and score each against the 5 dimensions.** Munari cannot vision-score from inside the runtime — this is a hard limit, not a skipped check.

### README (Story 1-3) — 6 dimensions, 0-10 each

| # | Dimension | Score | Notes |
|---|---|---|---|
| 1 | **Brand Voice** | 9/10 | Clean Allura voice throughout. Zero banned phrases (`seamless`, `scalable`, `leverage`, `frictionless`). Warm/practical tone — "AI agents forget. Sessions end, context evaporates…" lands. Only docked 1 point: "RuVix gate" in the Governance section is a naming inconsistency vs. `RuVector` used everywhere else (see Issues #1). |
| 2 | **30-Second Comprehension** | 9/10 | H1 "Memory That Shows Its Work" + subtitle "The governed memory engine for AI agents — self-hosted, auditable, self-improving" communicates what Allura is in 2 lines. First 30 lines include the value-prop infographic + the without/with table — clear. |
| 3 | **Visual Integration** | 8/10 | All 4 infographics embedded with descriptive alt text. All referenced files exist (`grep -oE 'src="[^"]+"'` → 5 OK, 0 BROKEN). One minor: `./ECOSYSTEM.md#governance` anchor is broken (section is `## 7. Governance`, so GitHub anchor is `#7-governance`, not `#governance`) — see Issues #2. |
| 4 | **Information Architecture** | 9/10 | Section order is logical: Why → Six Layers → Self-Improvement → Receipt → Ecosystem → Quick Start → Plugins → Model Governance → Governance → License. 11 `##` headers, all anchored to the top nav. |
| 5 | **Technical Truthfulness** | 9/10 | RuVector as primary graph backend (AD-49), Neo4j 5.26 as read-only fallback — correct. Genesis Engine, SUPERSEDES, curator scoring (0.0–1.0), HITL gate all present. Repo count = 10 unique repos (table has 10 rows, repo map counts 14 uniques only because of `.git` URL variants). |
| 6 | **Portfolio Polish** | 8/10 | No typos caught (`recieve\|seperate\|occured\|untill\|begining\|the the\|a a` → 0 matches). Formatting consistent. Docked 2 points: broken `#governance` anchor + the RuVix/RuVector naming inconsistency. |

**Average: 8.67 / 10** — passes the 7/10 threshold with no dimension below 5.

---

## Issues Found

| # | Severity | Story | Issue | Fix |
|---|---|---|---|---|
| 1 | **minor** | 1-3 (README) | Line 206: `RuVix gate` — should be `RuVector gate` (or `RuVix` if that's an intentional product name for the gate component, but every other mention in `ALLURA-LAYOUT.md:155` and the rest of the ecosystem uses `RuVector`). Naming inconsistency hurts brand clarity. | Replace `RuVix` with `RuVector` (or clarify `RuVix` is the gate name vs. `RuVector` the engine — if intentional, add 1 sentence). |
| 2 | **minor** | 1-3 (README) | Line 219: `[ECOSYSTEM.md](./ECOSYSTEM.md#governance)` — the `#governance` anchor does not exist. ECOSYSTEM.md uses `## 7. Governance`, which GitHub autogenerates as `#7-governance`. | Change to `./ECOSYSTEM.md#7-governance` (or add an explicit `<a id="governance"></a>` anchor in ECOSYSTEM.md). |
| 3 | **deferred** | 1-2 (Infographics) | Munari cannot vision-score the 4 PNGs from inside the runtime. Brand-compliance checks #4 (colors/tokens), #7 (image accessibility/contrast), and the entire 5-dimension rubric require a human to look at the images. | Ronin opens the 4 PNGs and scores each on the 5-dimension rubric. Pass = 7/10 avg, no dimension below 5. |

No **blockers** found. No **major** issues found. Three minor/deferred items only.

---

## Required Fixes Before Epic Can Be Called Done

1. **(Munari cannot do)** Ronin runs the 5-dimension vision-score on the 4 infographics. This is the only true gate left — the auto-verification proves the files are valid PNGs at the right dimensions, but brand compliance requires a human look.
2. **(Trivial)** Fix the `RuVix` → `RuVector` naming inconsistency in `README.md:206` (and the matching mention in `docs/ALLURA-LAYOUT.md:155` if that one is also wrong — verify intent first; if `RuVix` is the gate component name vs. `RuVector` the storage engine, document it once).
3. **(Trivial)** Fix the broken `./ECOSYSTEM.md#governance` anchor in `README.md:219`.

Fixes 2 and 3 are 30-second edits. Fix 1 is the real gate.

---

## Validation Command Outputs

### Story 1-1 — Stale Docs

```
=== STALE CLAIMS (should be empty) ===
(empty)  ✅ no doc claims Neo4j is primary or migration is in-progress

=== RUVECTOR COUNTS (per file) ===
docs/ALLURA-CONSOLIDATION-GOAL.md:8
docs/ALLURA-CONSOLIDATION-PLAN.md:5
docs/ALLURA-LAYOUT.md:8
docs/ARCHITECTURE.md:28  ✅ all 4 docs reference RuVector / AD-49

=== GENESIS IN ARCHITECTURE ===
9  ✅ ARCHITECTURE.md references Genesis / self-improvement / pattern-detect 9 times

=== BANNED PHRASES DOCS (should be empty) ===
(empty)  ✅ no banned phrases in any of the 4 docs

=== BLUEPRINT XREF (per file, should be ≥1) ===
docs/ALLURA-CONSOLIDATION-GOAL.md:1
docs/ALLURA-CONSOLIDATION-PLAN.md:1
docs/ALLURA-LAYOUT.md:1
docs/ARCHITECTURE.md:2  ✅ all 4 cross-reference BLUEPRINT.md

=== LAYOUT projects/workspace/.opencode ===
13  ✅ LAYOUT.md references projects/, workspace/, .opencode/policy/ 13 times

=== ARCH six-layer + self-improvement ===
21  ✅ ARCHITECTURE.md covers six-layer + self-improvement + append-only 21 times

=== Namespace drift (should only be the policy text) ===
docs/ARCHITECTURE.md:- **`allura-*` namespace only** — flag any `roninclaw-*` as drift.
README.md:| POL-006 | `allura-*` namespace only — any `roninclaw-*` is flagged as drift |
✅ only the policy-definition mentions of roninclaw- (correct)
```

### Story 1-2 — Infographics

```
=== FILE TYPES ===
docs/images/infographic-memory-receipt.png:   PNG image data, 1024 x 768, 8-bit/color RGB, non-interlaced
docs/images/infographic-self-improvement.png: PNG image data, 1024 x 768, 8-bit/color RGB, non-interlaced
docs/images/infographic-six-layer.png:        PNG image data, 1024 x 768, 8-bit/color RGB, non-interlaced
docs/images/infographic-value-prop.png:       PNG image data, 1024 x 768, 8-bit/color RGB, non-interlaced
✅ all 4 are valid PNGs at expected 1024×768

=== IMAGE SIZES ===
252 KB / 354 KB / 411 KB / 1.0 MB
✅ all reasonable, no 0-byte, no absurdly large
```

### Story 1-3 — README

```
=== BANNED PHRASES README (should be empty) ===
(empty)  ✅

=== INFOGRAPHICS REFCOUNT ===
4  ✅ all 4 infographics referenced

=== SELF-IMPROVEMENT MENTIONS ===
9 lines matching self.improvement|genesis|curator|supersedes
✅ Self-improvement loop has its own section (## The Self-Improvement Loop, line 76)

=== BEFORE/AFTER TABLE ===
| Without Allura | With Allura |  ✅ present at line 39

=== INDUSTRY CTX ===
2 lines matching mem0|zep|letta|cognee|supermemory
✅ "Mem0, Zep, Letta, Cognee, and Supermemory all store agent memory. None of them govern it."

=== REPO MAP COUNT ===
10 rows in the repo table (17 grep hits because .git URL variants double-count)
✅ 10 repos listed, matches the "10 repos" claim

=== LINE COUNT ===
229 lines

=== BROKEN IMAGE LINKS ===
OK: docs/images/allura-wordmark.png
OK: docs/images/infographic-value-prop.png
OK: docs/images/infographic-six-layer.png
OK: docs/images/infographic-self-improvement.png
OK: docs/images/infographic-memory-receipt.png
✅ 5/5 image refs resolve to real files

=== RELATIVE MARKDOWN LINKS ===
OK: ./ECOSYSTEM.md
BROKEN: ./ECOSYSTEM.md#governance   ⚠️ (see Issues #2)

=== TYPO CHECK ===
0 matches for recieve|seperate|occured|untill|begining|the the|a a
✅ no common typos
```

### Story 1-4 — Notion Dashboard (verified live via Notion MCP)

```
=== In Progress section ===
✅ "Ecosystem Presentation & Documentation Refresh" — Status: In Progress (verified via notion-query-data-sources on collection 8901d9be-65b3-8303-ba50-871a6b7f02bd)
   Summary: "Epic to turn the Allura ecosystem repo from a vibe-coded index into a portfolio-ready front door…"

=== Allura_Memory Epic Level 4 ===
✅ "Allura_Memory — Epic Level 4: Pattern Learning & Self-Evolution" — Status: Done
   Summary: "Epic Level 4 of the Allura_Memory repo is DONE: Pattern Learning & Self-Evolution…"

=== Story pages 1-1 through 1-6 ===
✅ notion-search for "Story 1-1 1-2 1-3 1-4 1-5 1-6 Ecosystem Presentation" returned all 6 story pages:
   - Story 1-1: Update 4 stale ecosystem docs (RuVector cutover + Genesis Engine)
   - Story 1-2: Generate 4 infographics via fal.ai (brand-baked, vision-scored)
   - Story 1-3: Rewrite ecosystem README with value narrative + infographics + Allura voice
   - Story 1-4: Update Notion dashboard with current project status
   - Story 1-5: Code review all deliverables against rubric
   - Story 1-6: Retrospective — log lessons, assess success

=== Skills section (≥14 new skills required) ===
✅ 15 new skills added to Skills Library (collection b881d9be-65b3-83eb-a9e6-870fb6dc823a) on 2026-07-25:
   1.  allura-code-review            (Review, Engineering Practice)
   2.  code-review                   (Review, Engineering Practice)
   3.  security-bluebook-builder     (Security, Engineering Practice)
   4.  varlock                       (Security, Engineering Practice)
   5.  allura-bitwarden-cowork-secret-provider (Security, DevOps/Infra)
   6.  postgres-best-practices       (Database, DevOps/Infra)
   7.  allura-health-observability   (Implementation, DevOps/Infra)
   8.  allura-team-ram               (Workflow, Allura/Ops)
   9.  systematic-debugging-memory   (Debugging, Engineering Practice)
   10. allura-memory-core            (Database, Memory/Brain)
   11. allura-retrieval-drift-audit  (Debugging, Memory/Brain)
   12. allura-fal-ai-image-editing   (Implementation, AI/ML)
   13. allura-promotion-roundtrip    (Database, Memory/Brain)
   14. allura-hydration-integrity    (Database, Memory/Brain)
   15. carloss-integrity-audit       (Review, Engineering Practice)
   ✅ exceeds the 14-skill requirement

=== Frameworks section (4 required) ===
✅ 4 new frameworks added to Frameworks collection (5ff1d9be-65b3-82e3-868b-07b807dc5d6f) on 2026-07-25:
   1. Six-Layer Memory Architecture                          (Platform, Active)
   2. RuVector Boundary (RuVector executes, Allura governs) (Infrastructure, Active)
   3. Self-Improvement Loop (Curator + Genesis Engine + SUPERSEDES) (Spec-Driven System, Active)
   4. BMad Method Workflow (allura-memory repo)             (Spec-Driven System, Active)
   ✅ all 4 required frameworks present and marked Active
```

---

## Verdict

**Partial pass.** Docs, README, and Notion dashboard all pass their rubrics. The only gate left before the epic can be called done is **Ronin's 5-dimension vision-score on the 4 infographics** — Munari cannot perform this check from inside the runtime, and brand compliance explicitly requires a human look at color tokens, contrast, and visual hierarchy.

Once Ronin scores the infographics (≥7/10 avg, no dimension <5) and the two trivial README fixes are applied, the epic is done.

— Munari, Team Durham QA