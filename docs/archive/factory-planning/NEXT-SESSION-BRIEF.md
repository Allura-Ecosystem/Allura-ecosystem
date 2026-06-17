# Next Cowork Session Brief — Allura Stack
**Prepared:** 2026-06-10 by Brooks | **Previous session receipts:** Brain `allura-system` (session_end `04d28b9b`)

---

## 1. Where Everything Stands

| Workstream | State | Waiting On |
|---|---|---|
| GitHub org `Allura-Ecosystem` | ✅ Live (renamed from typo). `allura` repo public+empty, `mortagate` private | — |
| Monorepo migration | 🟡 BLOCKED at gitleaks gate — **202 leaks** in combined history | Sabir: drop `gitleaks-report-redacted.json` into allura-memory → Brooks triages → rotate keys → filter-repo → push |
| Migration artifacts | ✅ Ready: `allura-stack-migration-plan.md`, `allura-stack-migration.sh`, `monorepo-seed/` (brand README + assets) | — |
| GitHub PAT | ⚠️ Lacks org admin (403 on org repo create) | Sabir: rotate PAT (fine-grained, resource owner = Allura-Ecosystem, or classic repo+admin:org) → update Docker MCP secret |
| Durham repo harness | 🟡 Upgrades staged in `brand-maker/durham-agent-upgrades/` (BRAIN-CONNECTION contract + reality-checker + evidence-collector + agentic-trust-architect) | Sabir: `cp durham-agent-upgrades/*.md .claude/agents/` |
| Durham plugin | 🟡 v0.2.0 at source (`team-durham-plugin/`) — Brain Contract in all 9 skills | Sabir: reinstall plugin (installed copy is still v0.1.0) |
| BMad factory | ✅ ADR decided + overlay template v0.1: `allura-agent-factory-adr.md` | Decisions: generator as plugin vs skill; marketplace; tenant provisioning |
| Allura_Memory PRs | #47 merged ✅; #50 (embeddings provider) open draft, mergeable | Merge or carry to monorepo |

**⚠️ Urgent regardless of migration:** engine history is ALREADY public in `Charitablebusinessronin/Allura_Memory` — any real key in those 202 findings is exposed today. Rotation comes before redaction.

## 2. Critical Path (do in order)

1. Gitleaks triage → key rotation → `git filter-repo` → clean scan → push monorepo.
2. Install Durham upgrades (cp) + reinstall plugin v0.2.0.
3. Wire CI into the monorepo at first push: gitleaks, skill validation, contract-sync check.

## 3. Architect's Assessment (Brooks, end of session 2026-06-10)

**Keep:** "Logs are not knowledge" is the moat — protect it. Governance consistency across layers is rare; don't dilute it. BMad-as-authoring-layer was right: buy accidental complexity, own essential complexity (governance + memory).

**Change — priority order:**

1. **Close ONE loop before opening another.** The Definition of Done (trace → curate → approve → retrieve, end-to-end, every step receipted) has not been demonstrated clean and recorded. It is the proof the whole ecosystem rests on. Freeze new verticals/harnesses until it has a receipt. *(Second-system effect warning.)*
2. **Generate governance, don't hand-copy it.** Four drifting copies of the same protocol prose were found this session (Brooks / Durham repo / Durham plugin / .opencode shims — ghost agents, broken refs, tool-list contradictions). Build the overlay generator from the factory ADR early; make the contract a build artifact with one source.
3. **Kernel enforcement > prompt enforcement.** Only the Postgres `group_id` CHECK has real teeth today. Append-only must be a DB rule, HITL an API gate. Prompt-level governance = defense-in-depth, never the wall. A regulator will ask which invariants are enforced vs aspirational.
4. **Hygiene before publicity.** Pre-commit gitleaks hooks on every repo (cheap, today). Docs: make GitHub the only write surface, Notion a read-only mirror, automate the sync — stop re-adjudicating direction.
5. **Eat the dog food.** The proof-gate system would bounce its own builder: Notion pages with empty CI fields, placeholder PRs, zeroed counters. CI from monorepo commit one; let RuVix grade Allura's own work.

## 4. Durham Backlog (pick-up list)

- 3 audit fixes: `openagent.md` frontmatter can't use the Brain tools its body demands; `workflow-architect.md` missing 4/9 elements; collapse `kotler.md` to YAML-only stub → brand-orchestrator.
- New skill: **AEO / agentic-search optimizer** (gap verified — marketing plugin covers classic SEO only).
- Refactor: `orchestrate` skill → per-phase step files (BMad JIT pattern).
- Plugin validation gate → lands as monorepo CI step.

## 5. Key Locations

- Migration kit + ADR + this brief: `allura-memory/` (workspace folder)
- Durham staged upgrades: `brand-maker/durham-agent-upgrades/` (+ INSTALL.md)
- Durham plugin source: `brand-maker/team-durham-plugin/` (v0.2.0)
- Team RAM canon: `Allura-ecosystem/Allura-TeamRam/.claude/agent/core/brooks.md`
- GitHub MCP: load via `MCP_DOCKER mcp-add github-official` (authenticated as Charitablebusinessronin)

## 6. Session Opening Protocol (next time)

1. Brooks online → Brain hydration (`allura-system`).
2. Ask: did the gitleaks report land? Durham cp done? Plugin reinstalled? PAT rotated?
3. Verify repo states via GitHub MCP before advising — trust receipts, not memory.
