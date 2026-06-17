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
```

See [ECOSYSTEM.md](./ECOSYSTEM.md) for the full topology.

## What Allura Is

Allura is not a chatbot, not a framework, not a platform. It is a **governed memory engine**:

- **Episodic memory** (PostgreSQL + pgvector) — raw events, conversations, observations
- **Semantic memory** (Neo4j) — curated knowledge, relationships, approved facts
- **Curator layer** — human-in-the-loop promotion from episodic → semantic
- **RuVix enforcement** — policy gates, direct-access blocking, audit trails
- **MCP-native** — every agent talks to Allura through standard MCP tools

## Repo Map

| Repo | Role | Visibility |
|------|------|------------|
| [Allura_Memory](https://github.com/Allura-Ecosystem/Allura_Memory) | The brain — core memory engine | Public |
| [allura-team-ram](https://github.com/Allura-Ecosystem/allura-team-ram) | Engineering harness (deep implementation) | Public |
| [allura-team-durham](https://github.com/Allura-Ecosystem/allura-team-durham) | Brand harness (design, copy, strategy) | Private |
| [allura-plugins](https://github.com/Allura-Ecosystem/allura-plugins) | Dual-runtime plugin catalog | Private |
| [.github](https://github.com/Allura-Ecosystem/.github) | Org profile & community health files | Public |
| [allura](https://github.com/Allura-Ecosystem/allura) | Reserved namespace | Public |

## Governance

Allura is governed by six invariant policies (POL-001 through POL-006) enforced by the RuVix gate. Every memory write, promotion, and retrieval is audited. No agent bypasses the gate.

See [ECOSYSTEM.md](./ECOSYSTEM.md#governance) for details.

## License

Allura is open source. See individual repos for license terms.
