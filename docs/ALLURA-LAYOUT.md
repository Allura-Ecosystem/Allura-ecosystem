# Allura Ecosystem — Target Layout & README Plan

> Brooks (Chief Architect) · 2026-06-12 (updated 2026-06-14).
> Companion to ALLURA-CONSOLIDATION-PLAN.md + ALLURA-CONSOLIDATION-GOAL.md.
> **Status:** PLAN + PARTIAL EXECUTION. Some moves done, some strays cleaned, layout not yet imposed.

## Principle
One folder, one repo, one mental model. `apps/` = things you ship. `packages/` = shared code
everything imports. `tooling/` = how we build and run. Everything else is noise to be removed
or archived. Conceptual integrity: a newcomer should understand the whole map in 60 seconds.

## Target layout (Turborepo + pnpm)

```
Allura-ecosystem/                 # THE one home (becomes the repo root)
├── apps/                         # deployable products
│   ├── brandmaker/               # ← Allura-brandmaker
│   ├── agents/                   # ← ai-agents (runnable agent app)
│   └── mortgage-audit/           # ← Client-Projects/mortgage-audit
├── packages/                     # shared libraries (imported via @allura/*)
│   ├── memory/                   # ← allura-memory  (the Brain: PG + Neo4j interface)
│   ├── team-ram/                 # ← Agent-Harnesses/Allura-TeamRam (agent defs/harness)
│   ├── plugins/                  # ← allura-plugins
│   ├── config-eslint/            # shared lint config
│   ├── config-typescript/        # shared tsconfig
│   └── types/                    # shared TS types/contracts
├── tooling/                      # dev tooling, not shipped
│   ├── factory/                  # ← factory
│   └── mcp/                      # MCP harnesses / scripts
├── docs/                         # mirror of Notion (source of truth = Notion)
│   ├── adr/                      # architecture decision records
│   └── planning/
├── .github/                      # CI/CD workflows
├── turbo.json                    # task pipeline
├── pnpm-workspace.yaml           # workspace globs: apps/*, packages/*, tooling/*
├── package.json                  # minimal root: turbo + repo tooling only
├── .gitignore                    # the corrected one (node_modules, build, binaries…)
└── README.md                     # the map below
```

## Mapping: current → target

| Current | Target | Note |
| --- | --- | --- |
| `Allura-brandmaker/` | `apps/brandmaker/` | fold in (decided) |
| `ai-agents/` | `apps/agents/` | confirm if app vs library |
| `Client-Projects/mortgage-audit/` | `apps/mortgage-audit/` | client work — confirm if it belongs in this repo |
| `allura-memory/` | `packages/memory/` | submodule → folder (needs decision) |
| `Agent-Harnesses/Allura-TeamRam/` | `packages/team-ram/` | submodule → folder (needs decision) |
| `allura-plugins/` | **stays a submodule** (NOT folded in) | DECIDED: canonical org catalog, own release cycle + validation DoD, cross-runtime (Claude+Codex) |
| `factory/` | `tooling/factory/` | |
| `web/payload/auntie-ny/` | `web/payload/auntie-ny/` (keep) | **DECIDED 2026-06-14**: 93 MB, cloned from `Charitablebusinessronin/auntienyastro-recovered`. Payload 3.x + Next.js 16. Stays in `web/payload/` — gitignored sibling, matches sibling-project pattern. |
| `web/payload/dd-site-payload/` | `web/payload/dd-site-payload/` (keep) | **DECIDED 2026-06-14**: 6.6 GB, pre-moved from `Projects/web/`. Payload 3.82.1 + Next.js 16.2.3 + pnpm 10.33.0 + Vercel Postgres/Blob/Resend. Stays in `web/payload/` — gitignored sibling. |
| `docs/` | `docs/` | **RESOLVED 2026-06-14**: consolidation .md files moved from root into docs/. Now contains ARCHITECTURE.md, ALLURA-CONSOLIDATION-{GOAL,PLAN}.md, ALLURA-LAYOUT.md, journal/. |
| ~~`memory/` (root)~~ | ~~merge into `packages/memory/` or delete~~ | **RESOLVED 2026-06-14**: journal entry moved to `docs/journal/2026-06-11.md`, empty dir deleted. |
| ~~`allura-memory-metadata-fix/`~~ | ~~delete / archive~~ | **RESOLVED**: not present on disk. |
| ~~`mortgage - audit/` (with spaces)~~ | ~~delete~~ | **RESOLVED 2026-06-14**: deleted (68-byte opencode.jsonc stub, redundant with Client-Projects/mortgage-audit/). |
| `.github-public/` | keep as `.github` or `docs/` | submodule — decide |
| `opencode.jsonc` | repo root | keep |
| ~~`opencode.jsonc.bak.20260613-230932`~~ | ~~delete~~ | **RESOLVED 2026-06-14**: deleted (byte-identical to live opencode.jsonc). |
| ~~`.opencode-router/`~~ | ~~delete~~ | **RESOLVED 2026-06-14**: deleted (empty stub, no references). |
| ~~`/media/ronin704/Games/linux-home/.codex/worktrees/{9b72,4376}/auntie ny/`~~ | ~~delete~~ | **RESOLVED 2026-06-14**: 2.6 GB orphan worktrees deleted. Upstream clone is source of truth. |
| ~~`/media/ronin704/Games/Projects/auntie ny/`~~ | ~~delete~~ | **RESOLVED 2026-06-14**: 1.5 GB stale partial from aborted cp -a deleted. |
| `.git-pollution-quarantine-20260613/` | delete | 32 KB stale configs (BehaviorSpec, mcporter.json, policies). Safe to delete. |

## README.md — what it should contain

1. **What Allura is** — one paragraph: the command center (memory, planning, governance,
   operations) across Sabir's projects (Faith Meats, Difference Driven, client work).
2. **Ecosystem map** — the tree above, one line per app/package on what it does.
3. **Quick start** — `pnpm install` → `pnpm dev` / `turbo build`. Node/pnpm versions.
4. **The Brain** — what `packages/memory` is (Postgres + Neo4j), group_id `allura-system`,
   how agents read/write it.
5. **Team RAM** — what the agent harness is, how Brooks + the surgical team operate.
6. **Governance** — invariants, decision logging, Notion = source of truth (docs/ is mirror).
7. **Contributing** — branch/PR flow, CODEOWNERS, "no PR merges without doc updates."
8. **Status** — what's stable vs in-progress (link to the consolidation plan).

## Open questions (before any move)
1. `ai-agents` and `mortgage-audit`: app or library? client work in this repo or separate?
2. The 3 submodules (memory, team-ram, plugins): convert to folders (matches "one folder")
   or keep as submodules? You folded brand-maker in — same treatment for these?
3. ~~Strays (`memory/`, `allura-memory-metadata-fix/`, `mortgage - audit/`): confirm safe to
   archive/delete once contents are verified merged.~~ **RESOLVED 2026-06-14**: all three strays cleaned.
4. `@allura/*` as the internal package namespace — good?
5. ~~**NEW 2026-06-14**: `web/payload/` path reconciliation — keep as `web/payload/` (current, gitignored sibling) or move to `Client-Projects/payload/` (original ask, under existing client projects)?~~ **RESOLVED 2026-06-14**: `web/payload/` stays. Gitignored sibling, matches sibling-project pattern (`/web/`, `/design/`, `/tools/`).
