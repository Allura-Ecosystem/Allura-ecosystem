# Story 1.2: Generate 4 Infographics via fal.ai

> Status: ready-for-dev
> Epic: Ecosystem Presentation & Documentation Refresh
> Owner: Glaser (Team Durham visual director) + fal.ai via genmedia
> Estimated: 1-2 hours (with iteration loops)

## Context

The ecosystem repo has zero infographics. The allura-memory repo has 4 brand assets in `public/readme/` (wordmark, hero, memory-flow, infographic). The ecosystem repo needs its own visual identity that communicates the value prop, the architecture, the self-improvement loop, and the memory receipt.

Industry context: No competitor has governance or self-improvement. The infographics must make these visible — they are the moat.

## The 4 Infographics

### Infographic 1: "Memory That Shows Its Work" (Value Prop)

**Purpose:** 30-second comprehension of why Allura exists.

**Composition:** Split panel, before/after.
- Left panel (muted, gray): "Without governed memory" — agent with a thought bubble that fades, question marks, no provenance, black box
- Right panel (warm, Allura palette): "With Allura" — same agent, but now with a receipt/trail showing: recorded → scored → approved → retrieved, each step timestamped and attributed
- Center divider: the Allura wordmark (real asset, not generated)

**One sentence:** "Your agent's memory shouldn't be a black box — it should show its work."

### Infographic 2: "The Six-Layer Memory Plan" (Architecture)

**Purpose:** Explain the actual system in one image.

**Composition:** Vertical flow, 6 stacked horizontal bands (top to bottom):
- Layer 1: RAW TRACES (PostgreSQL, append-only) — charcoal
- Layer 2: CURATOR PIPELINE (proposes, never decides) — blue
- Layer 3: VERSIONED KNOWLEDGE (RuVector/Neo4j, immutable) — gold
- Layer 4: APPROVAL GATE (human-in-the-loop) — orange
- Layer 5: RETRIEVAL LAYER (governed query service) — blue
- Layer 6: POLICY / API LAYER (one controlled door) — charcoal
- Each band: layer name (left), what enters (arrow from left), what exits (arrow to right), the rule (small text)
- Bottom caption: "Logs are not knowledge. Each layer has a job."

**One sentence:** "Six layers, one rule: logs are not knowledge."

### Infographic 3: "The Self-Improvement Loop" (The Differentiator)

**Purpose:** Show the thing no competitor has — the system gets better at helping agents by learning from what they do.

**Composition:** Circular flow (clockwise):
1. Agent acts → Raw trace (PostgreSQL, append-only)
2. Curator scores (0.0-1.0 + reasoning)
3. Score ≥ 0.85? → Auto-promote / Score < 0.85? → HITL approval queue
4. Promoted to knowledge graph (immutable, versioned via SUPERSEDES)
5. Genesis Engine watches trajectories (7-day window)
6. Pattern detected? → Propose new skill/workflow
7. Agent uses new skill → better outcomes → new traces
8. (loop continues — the system compounds)

**One sentence:** "The only memory system that gets better at helping you."

### Infographic 4: "The Memory Receipt" (What the User Sees)

**Purpose:** Make "shows its work" tangible — show what a single memory looks like with full provenance.

**Composition:** A single "memory card" styled like a receipt:
- Top: memory content (one line, e.g., "User prefers warm, cinematic photo edits")
- Below: provenance fields — Recorded by, Recorded at, Source, Score, Approved by, Approved at, Version, Supersedes
- Bottom: "This is why you can trust it"
- Styled like an actual receipt (monospace, dotted lines, warm paper texture)

**One sentence:** "Every memory comes with a receipt."

## Brand Constraints (baked into every prompt)

```
Palette: cream #FAF7F2, charcoal #2A2A2A, blue #3B6BA8, orange #E8923C, gold #D4A547
Style: editorial infographic, not AI art, not SaaS dashboard mock
No logos, no wordmarks in image body (except Infographic 1 center divider)
No purple AI gradients, no cyberpunk, no dark panels
Typography: display heading, body labels, caption — clear hierarchy
Real wordmark reference: allura-memory/public/readme/allura-wordmark.png (for Infographic 1 only)
```

## Iteration Loop (near-100% pass)

```
Generate (brand-baked prompt via genmedia run)
  ↓
Auto-verify: dimensions valid, file not corrupt, palette in prompt, no logo instruction
  ↓
Vision-score: run image back through vision model against 5-dimension rubric
  ↓
Pass (all dimensions ≥ 7)? → use it
Fail? → diagnose which dimension failed → adjust prompt → regenerate
  ↓
Max 5 iterations per image
```

### 5-Dimension Rubric (0-10 each)

| Dimension | What "10" looks like |
|---|---|
| Philosophy Consistency | Matches Allura brand: warm, governed, evidence-first. Cream/charcoal/blue/orange/gold. No purple gradients. |
| Visual Hierarchy | One clear focal point, eye flows top→bottom, readable in 30 seconds |
| Detail Execution | Crisp edges, consistent strokes, aligned to grid, no clipping, proper kerning |
| Functionality | Communicates the actual system accurately. Reader understands architecture from image alone. |
| Innovation | Fresh visual metaphor, not stock flowchart, not SaaS diagram |

**Pass threshold: 7/10 average, no dimension below 5.**

## fal.ai Endpoints

| Infographic | Endpoint | Cost | Why |
|---|---|---|---|
| 1 (Value Prop) | `fal-ai/flux/schnell` | ~$0.003 | Fast, good for conceptual split-panel |
| 2 (Six-Layer) | `fal-ai/flux/schnell` or `fal-ai/bytedance/seedream/v5/lite/edit` | ~$0.003-0.035 | Structured diagram needs precision |
| 3 (Self-Improvement) | `fal-ai/flux/schnell` | ~$0.003 | Circular flow, conceptual |
| 4 (Receipt) | `fal-ai/flux/schnell` | ~$0.003 | Stylized receipt, text-heavy |

**Total cost estimate:** 4 images × up to 5 iterations = up to 20 calls. Worst case ~$0.50. Realistically ~$0.15.

## Output Location

```
docs/images/
├── infographic-value-prop.png      (Infographic 1)
├── infographic-six-layer.png       (Infographic 2)
├── infographic-self-improvement.png (Infographic 3)
└── infographic-memory-receipt.png  (Infographic 4)
```

## Acceptance Criteria

- [ ] 4 PNG files generated in `docs/images/`
- [ ] Each image vision-scored ≥ 7/10 on all 5 dimensions
- [ ] No image contains a generated logo or wordmark (except Infographic 1 center divider)
- [ ] All images use Allura palette (cream/charcoal/blue/orange/gold)
- [ ] No purple AI gradients, no cyberpunk aesthetic
- [ ] Each image communicates its one-sentence message in 30 seconds

## Validation

```bash
# Verify files exist
ls -la docs/images/infographic-*.png

# Verify dimensions (should be reasonable for README embedding)
file docs/images/infographic-*.png

# Vision-score loop documented in story completion
```

## Notes

- Use `genmedia run` CLI with FAL_KEY from Bitwarden
- Use `allura-brand` skill for brand compliance checklist
- Use `allura-fal-ai-image-editing` skill for fal.ai workflow
- Glaser (Team Durham) owns the visual direction; fal.ai executes
- Vision-score can use fal.ai vision models or a separate vision endpoint