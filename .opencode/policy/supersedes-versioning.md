# Policy: SUPERSEDES Versioning

**Severity:** P0 — block on violation
**Source:** `AGENTS.md` → "Neo4j versioning via SUPERSEDES — never mutate historical nodes."

## Rule

Neo4j `:Insight` nodes are **immutable**. To change an Insight, create a new node and link it to the old one with a `SUPERSEDES`, `DEPRECATED`, or `REVERTED` relationship.

Never `SET` a property on an existing `:Insight` node. Never `DELETE` an `:Insight` node.

## Why

Layer 3 of the six-layer architecture is "Versioned Knowledge." Versioned means: historical state is preserved. If you mutate a node in place, you destroy the lineage. You make it impossible to answer "what did we believe last week?" or "why did this Insight change?"

The entire approval and audit model depends on this. If a promoted Insight could be silently edited, the HITL approval would mean nothing.

## Allowed Cypher

```cypher
// Create a new Insight (always allowed)
CREATE (n:Insight {id: $id, content: $content, version: 2, ...})

// Link new to old (the versioning pattern)
MATCH (old:Insight {id: $oldId}), (new:Insight {id: $newId})
CREATE (new)-[:SUPERSEDES]->(old)

// Mark deprecated (still creating a relationship, not mutating the node)
MATCH (old:Insight {id: $oldId})
CREATE (new:Insight {id: $newId, status: "deprecated"})
CREATE (new)-[:DEPRECATED]->(old)
```

## Blocked Cypher

```cypher
// NEVER — mutating an Insight in place
MATCH (n:Insight {id: $id}) SET n.content = $newContent

// NEVER — deleting an Insight
MATCH (n:Insight {id: $id}) DELETE n

// NEVER — DETACH DELETE on Insights
MATCH (n:Insight) DETACH DELETE n
```

## Enforcement

- **Hook:** `neo4j-no-mutate-insight` (in `.opencode/plugins/allura-governance.ts`) inspects Cypher-bearing tool calls for `SET`/`DELETE` on `:Insight` nodes.
- **Agent instruction:** Agents MUST NOT issue SET or DELETE against `:Insight` nodes. To correct an Insight, create a new one and link with `SUPERSEDES`.

## Related

- `hitl-promotion-gate.md` — nothing goes active without HITL approval, including new versions.
- `logs-not-knowledge.md` — Insights are knowledge, not logs. The two layers are separate.