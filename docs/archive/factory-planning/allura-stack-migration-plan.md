# Allura Stack — GitHub Consolidation Plan

> Decision (2026-06-10, Brooks/Sabir): Hybrid structure — one GitHub **organization** holding a
> RuVector-style **core monorepo** plus separate vertical repos. History preserved. Public.
> Reference model: https://github.com/ruvnet/RuVector

## Target Structure

```
GitHub org: Allura-Ecosystem            (create at github.com/account/organizations/new)
│
├── allura                              ← THE core monorepo (public, RuVector-style)
│   ├── engine/                         ← from Charitablebusinessronin/Allura_Memory
│   │   └── docs/allura/                ← six-doc canon stays inside engine (canon rule unchanged)
│   ├── harnesses/
│   │   ├── team-ram/                   ← from local Allura-TeamRam (Brooks protocol, agents, skills)
│   │   └── team-durham/                ← from Charitablebusinessronin/team_durham
│   ├── sdk/                            ← future @allura/sdk (AD-35 Phase 1)
│   ├── plugins/                        ← future: allura-cowork, allura-scout, memory-cowork…
│   ├── docs/                           ← stack-level README map only; canon stays in engine/
│   ├── .claude/                        ← shared harness config (like RuVector's .claude/)
│   └── README.md / LICENSE (MIT) / CHANGELOG.md
│
└── mortagate                           ← separate repo (Salesforce QC vertical)
                                          ⚠ recommend PRIVATE — see Risks
```

Why hybrid (Brooksian rationale): the monorepo preserves conceptual integrity for the *product
stack* — one Brain, its harnesses, its SDK, one governance model, one release surface. Mortagate is
a consuming vertical with a different deploy target (Salesforce DX) and different compliance
surface; entangling it in the stack repo couples release cadences that have nothing in common.

## Source Inventory

| Source | Location | Destination | History method |
|---|---|---|---|
| Allura Memory Engine | github.com/Charitablebusinessronin/Allura_Memory | `allura/engine/` | `git subtree add` |
| Team RAM harness | local: `/media/ronin704/Games/Projects/Allura-ecosystem/Allura-TeamRam` | `allura/harnesses/team-ram/` | subtree from local clone (init repo first if not one) |
| Team Durham | github.com/Charitablebusinessronin/team_durham | `allura/harnesses/team-durham/` | `git subtree add` |
| Mortagate | local: `/home/ronin704/Documents/Claude/Projects/Mortagate` | `Allura-Ecosystem/mortagate` (own repo) | push as-is |

`git subtree add` keeps every source commit reachable in the monorepo (merge-commit join), which
satisfies the Allura auditability principle without rewriting hashes.

## Gates (in order — do not skip)

1. **Org created** — GitHub orgs can't be created by CLI; do it in the web UI once.
2. **Open PRs merged or noted** — Allura_Memory PR #47 (CI pending) and draft PR #50 land in the
   OLD repo. Merge or carry the branches over before/after subtree; new work happens in the monorepo.
3. **Secret scan on full history** (`gitleaks`) — HARD GATE before any public push. Preserved
   history + public repo means every `.env`, API key, or credential ever committed becomes public.
4. **Push + verify** — clone fresh, confirm `git log --follow` works into subtree history.
5. **Archive old repos** — GitHub Settings → Archive, with a pointer README. Never delete
   (append-only principle applies to repos too).

## Risks & Decisions

| Risk | Severity | Mitigation |
|---|---|---|
| Secrets in preserved history go public | **HIGH** | gitleaks gate (step 3); if hits found, `git filter-repo` redaction BEFORE first push, never after |
| Mortagate public = mortgage/compliance demo exposed | MED | Recommend mortagate stays **private**; org can mix visibilities |
| Open PRs (#47, #50) orphaned in old repo | MED | Merge first, or recreate branches in monorepo from same commits |
| Team RAM local folder may not be a git repo | LOW | Script auto-inits with single baseline commit |
| Notion/docs links point at old repo URLs | LOW | Archive (not delete) keeps URLs alive; update canon links in a follow-up pass |
| group_id drift during move | LOW | Nothing changes: `allura-system` for Team RAM ops, `allura-mortagate` for Mortagate |

## Open items (need your call)

1. **Org name** — script defaults to `Allura-Ecosystem`. Change `ORG=` if you want `allura-ai`, etc.
2. **Mortagate visibility** — script defaults it to **private**; flip the flag if you truly want it public.
3. **allura-dashboard** — you left it out of the stack. It stays local until you decide its home.

## Execution

Runbook script: `allura-stack-migration.sh` (same folder). Run it **on your workstation** (not in
a sandbox) — it needs your `gh` auth and access to the local folders.

```bash
# prereqs (Ubuntu)
sudo apt install git
type gh || (curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && sudo apt update && sudo apt install gh)
gh auth login
pipx install gitleaks || sudo snap install gitleaks   # or download release binary

# then
bash allura-stack-migration.sh          # dry-run prints plan
bash allura-stack-migration.sh --run    # executes
```
