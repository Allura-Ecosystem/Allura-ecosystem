# Allura Evidence Hero v1 — QA Record

## Artifact

- Final image: `assets/portfolio/allura-evidence-hero-v1.png`
- Reproducible source: `assets/portfolio/allura-evidence-hero-v1.py`
- Prompt contract: `assets/portfolio/allura-evidence-hero-v1.prompt.yaml`
- Format: PNG, RGB, 1600×900
- Intended slot: neutral GitHub / portfolio hero image

## Validation results

| Check | Result | Evidence |
|---|---|---|
| PNG integrity | Pass | Pillow `Image.verify()` completed successfully. |
| Export dimensions | Pass | 1600×900 RGB. |
| Thumbnail crop | Pass | Generated 400×225 thumbnail retains the composition. |
| Generated-text check | Pass | Tesseract output was empty for both full-size and thumbnail exports. |
| Technical-claim check | Pass | The raster contains no labels, vendor marks, code, UI, performance claims, or architecture assertions. |
| Reference-role check | Pass | Only approved navy/white hierarchy, restrained layer treatment, and whitespace principles were used. No reference wording, logos, or specific layouts were copied. |
| Legacy-architecture check | Pass | No storage engine or database representation appears. |

## QA outcome

**Approve — v1.**

This is a text-free supporting visual. It is not an architecture diagram, an implementation claim, or a substitute for source-linked engineering evidence.

## Known limitation

The local fal workflow was unavailable at the time of production: no fal CLI or environment configuration was present. The asset was produced through the documented Codex/OpenDesign fallback using a reproducible local source. No generated-image-provider output is claimed.
