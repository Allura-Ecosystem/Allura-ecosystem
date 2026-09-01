# AGENTS.md

## What This Repository Is

`Allura-ecosystem` is the public source-of-truth **index** for the Allura repository model. It contains organization navigation, shared doctrine, topology, and historical planning records. It is not a monorepo and must not duplicate product or plugin source from sibling repositories.

The core principle remains: **logs are not knowledge.** Raw agent activity is evidence; durable knowledge is scoped, versioned, governed, and approved.

## Canonical Repository Model

| Repository | Authority |
|---|---|
| [`Allura_Memory`](https://github.com/Allura-Ecosystem/Allura_Memory) | Governed memory and control plane: MCP/API, PostgreSQL schema, PostgreSQL graph tables, RuVector adapter, curator, policy, and audit |
| [`allura-team-ram`](https://github.com/Allura-Ecosystem/allura-team-ram) | Canonical public Team RAM software-delivery harness source |
| [`team-durham`](https://github.com/Allura-Ecosystem/team-durham) | Canonical public Team Durham brand-production source; 12 canonical roles plus the `openagent` compatibility fallback |
| [`mortagate`](https://github.com/Allura-Ecosystem/mortagate) | Canonical public Mortgate Microsoft Copilot Cowork mortgage evidence-review product source |
| [`allura-plugins`](https://github.com/Allura-Ecosystem/allura-plugins) | Distribution catalog; pinned generated exports are downstream, non-authoritative copies |
| [`.github`](https://github.com/Allura-Ecosystem/.github) | Organization profile mapping the public surfaces |
| [`Allura-ecosystem`](https://github.com/Allura-Ecosystem/Allura-ecosystem) | This public topology and navigation index |

Standalone repositories own their source. Changes flow **source repository → validated export → pinned catalog copy**. Never repair Team RAM, Team Durham, or Mortgate by editing a generated `allura-plugins` export first.

## Active Allura Memory Architecture

Allura Memory uses one PostgreSQL engine with two governed logical layers:

1. **Episodic evidence** — append-oriented events, traces, proposals, and audit metadata in PostgreSQL 16 with pgvector.
2. **Curator pipeline** — proposes candidates; it does not silently declare truth.
3. **Versioned semantic knowledge** — `graph_memories`, `graph_supersedes`, and related PostgreSQL graph tables behind the `ruvector` adapter.
4. **Approval** — human approval is the accountable promotion boundary; automated curator behavior remains under review.
5. **Retrieval** — agents use governed MCP/API operations, not direct storage access.
6. **Policy/control plane** — identity, `group_id`, authorization, audit metadata, and visible failure behavior are enforced at the boundary.

Neo4j is not an active store or fallback. AD-49 records the PostgreSQL graph-table cutover and AD-50 records the PostgreSQL-only sunset. Preserve Neo4j references only in clearly historical or sunset context.

## Rules

- Treat this repository as an index, not a container for sibling product code.
- Use a valid `group_id` on memory operations; governed tenant namespaces follow `allura-*`.
- Keep episodic evidence append-oriented; do not rewrite traces into canonical knowledge.
- Preserve semantic lineage with `SUPERSEDES` rather than in-place historical mutation.
- Use governed MCP/API boundaries for agent-facing memory access.
- Do not present generated catalog exports as editable authority.
- Keep Mortgate's Microsoft Copilot Cowork runtime distinct from Claude/Codex plugin packages.
- Treat `mortagate/force-app/` and Salesforce/Veridact material as historical evidence, not the current product.
- Do not invent sibling paths, ports, deployment state, or health claims. Verify operational instructions in the owning repository README.
- Current Allura Memory README values: Compose gateway `http://localhost:6477` (`6477:3201`), direct development gateway port `3201`.
- Prioritize auditability, versioning, provenance, and evidence over speed.

## Documentation Precedence

1. Owning repository code, schema, machine-readable source/export contracts, and active configuration.
2. Accepted architecture decisions, including Allura Memory AD-49 and AD-50.
3. Owning repository README and canonical architecture docs.
4. This repository's `README.md` and `ECOSYSTEM.md` navigation summaries.
5. Archived plans, journals, client notes, and compatibility history.

## Validation for Index Changes

- Validate every repository and document link.
- Search changed active guidance for stale Neo4j-as-active claims, stale monorepo paths, and unresolved-data placeholders concerning verified public repositories.
- Run `git diff --check`.
- Run `gitleaks detect --no-banner --redact` when available.
- Inspect the final diff and confirm no product code or generated source copy was added.
