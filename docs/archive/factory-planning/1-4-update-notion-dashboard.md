# Story 1.4: Update Notion Dashboard

> Status: blocked-by-1-1
> Epic: Ecosystem Presentation & Documentation Refresh
> Owner: Brooks
> Estimated: 30 minutes

## Context

The Notion dashboard (https://app.notion.com/p/Allura-ecosystem-e821d9be65b383e78b6501774b312c6c) is out of sync with actual repo state. The docker-mcp gateway is running on port 8811 with notion-remote connected.

## What Needs Updating

### In Progress section
- Add: "Ecosystem Presentation & Documentation Refresh" epic
- Status: in-progress
- Stories: 1-1 through 1-6

### Current Tasks section
- Story 1-1: Update stale docs — status
- Story 1-2: Generate infographics — status
- Story 1-3: Rewrite README — status
- Story 1-4: Update Notion — status (this story)
- Story 1-5: Code review — status
- Story 1-6: Retrospective — status

### Projects / GitHub Repos section
- Allura_Memory: Epic Level 4 DONE (Pattern Learning & Self-Evolution)
- Allura-ecosystem: Ecosystem Presentation epic in-progress
- allura-plugins: 4 validated plugins, models.yaml registry
- allura-team-ram: v0.4.2 harness

### Skills section
- Add new skills created since last update:
  - allura-bitwarden-cowork-secret-provider
  - allura-fal-ai-image-editing
  - allura-code-review, allura-health-observability, allura-hydration-integrity
  - allura-memory-core, allura-promotion-roundtrip, allura-retrieval-drift-audit
  - allura-team-ram, carloss-integrity-audit, code-review
  - postgres-best-practices, security-bluebook-builder, systematic-debugging-memory
  - varlock

### Frameworks section
- Add: Six-layer memory architecture
- Add: RuVector boundary (RuVector executes, Allura governs)
- Add: Self-improvement loop (curator + Genesis + SUPERSEDES)
- Add: BMad Method workflow (allura-memory repo)

## How to Update

The docker-mcp gateway is running at `http://localhost:8811/mcp` with:
- Session ID: `RLCPWO63YYUICLLADHYFGSLB6K`
- Auth token: `[REDACTED — historical token removed]`

Tools available: `notion-fetch`, `notion-search`, `notion-create-pages`, `notion-update-page`, `notion-query-data-sources`.

### Steps
1. `notion-fetch` the dashboard page to get current state
2. `notion-search` for "In Progress" section
3. `notion-update-page` to add the new epic
4. `notion-search` for "Current Tasks" section
5. `notion-update-page` to add/update task entries
6. `notion-search` for "Skills" page, `notion-update-page` to add new skills
7. `notion-search` for "Frameworks" page, `notion-update-page` to add new frameworks

## Acceptance Criteria

- [ ] Notion dashboard "In Progress" section includes Ecosystem Presentation epic
- [ ] Notion dashboard "Current Tasks" section includes stories 1-1 through 1-6 with status
- [ ] Notion dashboard "Skills" section includes 14 new skills
- [ ] Notion dashboard "Frameworks" section includes six-layer architecture, RuVector boundary, self-improvement loop, BMad Method
- [ ] Allura_Memory project marked as Epic Level 4 DONE

## Validation

```bash
# Via docker-mcp gateway
curl -s -X POST http://localhost:8811/mcp \
  -H "Authorization: Bearer $TOKEN" \
  -H "Mcp-Session-Id: $SID" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"notion-search","arguments":{"query":"Ecosystem Presentation"}}}'
# Should return the new epic entry
```

## Notes

- Use docker-mcp gateway (running on port 8811)
- All Notion ops via MCP tools — never direct API calls
- Blocked by Story 1-1 (need doc updates reflected before dashboard sync)