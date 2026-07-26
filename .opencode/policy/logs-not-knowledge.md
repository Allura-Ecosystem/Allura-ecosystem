# Policy: Logs Are Not Knowledge

**Severity:** P2 — warn + log
**Source:** `AGENTS.md` → "logs are not knowledge. Raw agent activity is cheap and noisy. Knowledge is expensive, versioned, and approved."

## Rule

Raw traces (layer 1) are not Insights (layer 3). The two layers must never collapse. An Insight is built from traces only through the curator pipeline (layer 2) and approval gate (layer 4).

Never:
- Treat a log entry as a knowledge claim
- Promote a raw trace directly to Neo4j
- Retrieve raw traces as if they were approved Insights
- Skip the curator when "the answer is obvious from the log"

## Why

This is the single most important invariant in Allura. The whole architecture exists because logs are noisy and knowledge needs to be trustworthy. If you collapse the layers, you get the worst of both: the noise of logs with the authority of knowledge.

The six layers exist precisely to keep these two things separate. Every other policy (`append-only-traces.md`, `supersedes-versioning.md`, `hitl-promotion-gate.md`) protects this separation from a different angle.

## Enforcement

- **Agent instruction:** Agents MUST NOT write raw traces to Neo4j. Agents MUST NOT serve raw traces from the retrieval layer. The retrieval layer reads approved Insights only.
- **Skill:** `allura-memory-core` codifies the retrieve-before-plan, write-trace-after-work contract. It uses the retrieval layer for reads and the trace store for writes — never the other way around.

## Symptoms of Layer Collapse

Watch for these — each is a violation:

| Symptom | What's Wrong |
|---------|-------------|
| "I wrote the finding directly to Neo4j" | Skipped curator + approval |
| "The retrieval layer returned a trace row" | Retrieval is reading from the trace store, not the knowledge graph |
| "I marked the log entry as an Insight" | Collapsed layers 1 and 3 |
| "It's obvious, skip the curator" | Collapsed layers 2 and 4 |
| "I'll just edit the Insight to fix it" | Collapsed versioning (see `supersedes-versioning.md`) |

## Related

- `append-only-traces.md` — protects layer 1
- `hitl-promotion-gate.md` — protects layer 4
- `supersedes-versioning.md` — protects layer 3