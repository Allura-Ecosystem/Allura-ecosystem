# Allura Ecosystem

**Allura** is a self-hosted, governed memory engine for AI systems — the backbone that gives your agents durable, auditable, and policy-enforced memory.

This repository is the **ecosystem map** — the index that explains what Allura is, which projects consume it, where everything lives, and how the pieces connect. It is not a code repo; it is the source-of-truth index.

## Quick Start

```bash
# Clone the ecosystem map
git clone https://github.com/Allura-Ecosystem/Allura-ecosystem.git

# Clone the brain
git clone https://github.com/Allura-Ecosystem/Allura_Memory.git

# Clone a harness
git clone https://github.com/Allura-Ecosystem/allura-team-ram.git
git clone https://github.com/Allura-Ecosystem/allura-team-durham.git

# Clone the plugin catalog + model registry
git clone https://github.com/Allura-Ecosystem/allura-plugins.git
```

See [ECOSYSTEM.md](./ECOSYSTEM.md) for the full topology.

## What Allura Is

Allura is not a chatbot, not a framework, not a platform. It is a **governed memory engine**:

- **Episodic memory** (PostgreSQL + pgvector) — raw events, conversations, observations
- **Semantic memory** (RuVector graph adapter on PostgreSQL) — curated knowledge, relationships, approved facts. Neo4j 5.26 remains as read-only fallback (AD-49 cutover, 2026-07-12)
- **Curator layer** — human-in-the-loop promotion from episodic → semantic
- **RuVix enforcement** — policy gates, direct-access blocking, audit trails
- **MCP-native** — every agent talks to Allura through standard MCP tools

## Repo Map

| Repo | Role | Visibility |
|------|------|------------|
| [Allura_Memory](https://github.com/Allura-Ecosystem/Allura_Memory) | The brain — core memory engine | Public |
| [Allura-ecosystem](https://github.com/Allura-Ecosystem/Allura-ecosystem) | Ecosystem map — source-of-truth index | Public |
| [allura-team-ram](https://github.com/Allura-Ecosystem/allura-team-ram) | Engineering harness (10 specialists, self-evolving, HITL) | Public |
| [allura-plugins](https://github.com/Allura-Ecosystem/allura-plugins) | Plugin catalog + model governance registry (`models.yaml`) | Private |
| [allura-team-durham](https://github.com/Allura-Ecosystem/allura-team-durham) | Brand harness (design, copy, strategy) | Private |
| [agent-backups](https://github.com/Allura-Ecosystem/agent-backups) | Agent config backups (Hermes, OpenClaw, NanoClaw, OneCLI) | Private |
| [open-design](https://github.com/Allura-Ecosystem/open-design) | Local-first open-source Claude Design alternative (forked) | Public |
| [mortagate](https://github.com/Allura-Ecosystem/mortagate) | Veridact — mortgage audit replay & QC platform on Salesforce | Public |
| [.github](https://github.com/Allura-Ecosystem/.github) | Org profile & community health files | Public |
| [allura](https://github.com/Allura-Ecosystem/allura) | Reserved namespace (points to Allura_Memory) | Public |

## Plugin Marketplace

The [`allura-plugins`](https://github.com/Allura-Ecosystem/allura-plugins) repo hosts the `allura-ecosystem` Claude marketplace with 4 validated plugins:

- **allura-cowork** — Claude + Codex cowork protocol
- **team-durham** — Brand production team
- **team-ram-coding** — Brooks, Jobs, Scout, Woz workflows
- **team-ram-harness** — Full self-evolving 10-agent harness (v0.4.2)

Install across all 4 runtimes (Claude, Codex, Hermes, OpenClaw) with one command:
```bash
./scripts/plugins-update-all.sh
```

## Model Governance

The [`docs/models.yaml`](https://github.com/Allura-Ecosystem/allura-plugins/blob/main/docs/models.yaml) registry in `allura-plugins` is the **single source of truth** for agent→model mapping across all runtimes. It covers 47 agents across 7 models with per-runtime aliases, fallback chains, and CLASSIC eval fixtures.

Research-informed design: static registry (arxiv 2508.03095), centralized management (Solace Agent Mesh), per-agent override (OpenClaw), fallback chains (RouteLLM), CLASSIC eval framework (Aisera), three-level assessment (AWS/Amazon), canary before promotion.

## Governance

Allura is governed by six invariant policies (POL-001 through POL-006) enforced by the RuVix gate. Every memory write, promotion, and retrieval is audited. No agent bypasses the gate.

See [ECOSYSTEM.md](./ECOSYSTEM.md#governance) for details.

## License

Allura is open source. See individual repos for license terms.