---
name: allura-fal-ai-image-editing
description: "Edit or generate images for Allura-branded artifacts using fal.ai and GPT Image 2, via the genmedia CLI or fal-mcp-server. Assumes FAL_KEY is provided by allura-bitwarden-cowork-secret-provider or environment."
---

# allura-fal-ai-image-editing

## When to Use

Use this skill when an Allura project needs image edits or generation for READMEs, diagrams, marketing assets, or branded visuals. It is especially useful for making precise text/icon changes to existing diagrams while preserving the Allura visual style.

## Preferred Tool

- `genmedia run openai/gpt-image-2/edit` for precise edits to existing images.
- `genmedia run openai/gpt-image-2` for new image generation when no source exists.

## Prerequisites

- `genmedia` CLI installed and configured with `FAL_KEY`
- Source images available locally
- If `FAL_KEY` is in Bitwarden, use `allura-bitwarden-cowork-secret-provider` first

## Workflow

1. Ensure `FAL_KEY` is active:
   ```bash
   genmedia setup --non-interactive --api-key "$FAL_KEY"
   ```
2. Upload the source image to fal.ai CDN:
   ```bash
   genmedia upload <path-to-image>.png --json
   ```
3. Submit an async edit with explicit, constrained prompt:
   ```bash
   genmedia run openai/gpt-image-2/edit \
     --image_urls '["<cdn-url>"]' \
     --prompt "<exact change>. Preserve all other colors, text, layout, and composition." \
     --download "<output-path>" \
     --async --json
   ```
4. Poll with `genmedia status` until complete, then download.
5. Review the result for brand compliance before replacing the original.

## Prompting Rules

- Be specific about which text/icon to change and what to change it to.
- Always include: "Preserve the exact same warm cream background, typography, layout, colors, and composition."
- Never ask the model to invent a new logo or wordmark.
- For Allura diagrams, specify: warm cream, forest green, cobalt blue, burnt orange, gold palette.

## Brand Compliance Gate

Before replacing any repo image:

- No generated logos or logo-like marks
- Colors trace back to Allura docs or existing assets
- Text is legible and factually accurate
- Neo4j is shown only as fallback if shown at all
- RuVector PG tables is labeled as production default

## Async Polling

```bash
REQ_ID=<from submitted output>
genmedia status openai/gpt-image-2/edit "$REQ_ID" --download "<output-path>" --json
```

## Error Handling

- `User is locked. Reason: Exhausted balance` → top up at fal.ai/dashboard/billing, or use a different `FAL_KEY`.
- `Request is still in progress` → poll again after 30–60 seconds.
- `Input should be a valid list` → pass `image_urls` as a JSON array string: `'["url"]'`.

## Related Skills

- `allura-bitwarden-cowork-secret-provider` — retrieves `FAL_KEY` from Bitwarden.
- `allura-brand` — brand compliance review after image edits.
- `allura-design` — Huashu-design + Brain integration for larger design tasks.
