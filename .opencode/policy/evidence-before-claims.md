# Policy: Evidence Before Claims

**Severity:** P2 — warn + log
**Source:** superpowers `verification-before-completion` skill, adapted for Allura.

## Rule

No agent may claim work is "done," "fixed," "passing," or "shipped" without first running verification and showing the output. Evidence precedes assertion. Always.

This applies to:
- Code changes → run tests, show output
- DB migrations → run the migration, show the schema state
- Memory promotions → run `allura-promotion-roundtrip`, show the receipt
- Build/deploy → run the build, show the artifact
- "It works" → show the command output that proves it works

## Why

Claims without evidence are noise. In a governed system, they're worse than noise — they're false audit entries. If an agent says "migration complete" and the migration didn't run, every downstream agent acts on a lie.

The six-layer architecture depends on traces being truthful. A trace that says "done" without evidence is a trace that the curator will turn into a wrong Insight.

## Enforcement

- **Agent instruction:** Before claiming completion, run the verification command and include the output in your response. The output is the evidence. The claim without the output is a violation.
- **Skill:** superpowers `verification-before-completion` — load it when about to claim work is done.
- **Hook:** `verification-before-done` (in `.opencode/plugins/allura-governance.ts`) is a lighter check — it logs claims of completion and flags ones that lack preceding tool output.

## Examples

✅ Correct:
```
$ bash factory/validate.sh factory/teams/raleigh
[output showing pass]
Factory validation passed.
```

❌ Violation:
```
Factory validation passed.
```
(No command, no output — just the claim.)

## What Counts as Evidence

| Claim | Required Evidence |
|-------|-------------------|
| "Tests pass" | Test runner output showing green |
| "Migration done" | Migration command output + schema check |
| "Memory promoted" | `allura-promotion-roundtrip` receipt |
| "Build succeeded" | Build command output with success exit code |
| "Route works" | HTTP response with expected status/body |
| "Fixed" | Before/after output showing the bug is gone |

## Related

- superpowers `verification-before-completion` skill — the source discipline
- `allura-promotion-roundtrip` — evidence for memory promotions specifically