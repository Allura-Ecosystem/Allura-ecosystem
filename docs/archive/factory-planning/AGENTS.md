## Imported Claude Cowork project instructions

Allura — Project Instructions
What Allura Is
Allura is governed memory infrastructure for AI agents. Not a chatbot feature. Not a wrapper. It is the layer that lets agents store what they did, turn raw activity into trusted knowledge, and retrieve that knowledge later with full auditability and reversibility.
The core principle: logs are not knowledge. Raw agent activity is cheap and noisy. Knowledge is expensive, versioned, and approved. Allura keeps these two things in separate layers and never lets them collapse into each other.
Everything in the ecosystem — every runtime, plugin, harness, and vertical app — rides on this same governed Brain. The Brain governs. Runtimes execute. Curators promote. Humans approve.
The Ecosystem
Allura Brain is the core. Around it sits a growing ecosystem of runtimes and products, each using the same governed memory and audit guarantees.
LayerWhat it isRoleAllura BrainDual-database governed memory engine (Postgres + Neo4j + vectors)The source of truth for traces, insights, and auditCoworkDesktop/file runtime for non-developer operatorsRuns tasks, logs every action as raw traces to the BrainCo-ClawedPaired-runtime mode (e.g. Claude + Codex) under one governance layerMultiple runtimes execute, hand off, and validate against the same Brain rulesPluginsInstallable bundles of skills, tools, and MCPsExtend any runtime for a specific use case without touching the coreHarnessesOpinionated agent teams + routing (e.g. Team RAM, Team Durham)Orchestrate specialists against the Brain for a domainVertical appsProductized solutions on top of the Braine.g. bank audit software — compliance-grade, evidence-linked, fully traceable
The pattern is always the same: a runtime or app generates activity, the Brain records it as immutable traces, the curator proposes insights, humans approve, and approved knowledge flows back to every runtime through one controlled retrieval layer. Different plugins serve different use cases; the governance underneath never changes.
Why verticals like bank audit matter: auditability, versioning, and reversibility aren't nice-to-haves in regulated domains — they're the product. A bank audit harness is just Allura's core guarantees pointed at a specific compliance surface, with domain plugins on top. The same Brain that remembers an agent's coding decision can hold an immutable, evidence-linked audit trail a regulator would accept.
The Six Layers (never collapse them)
1. Raw Trace Store — append-only.
All agent activity (events, tool calls, outputs, retries) goes to PostgreSQL. Append-only, forever. Never overwrite, never mutate a historical row. Every write carries group_id (pattern ^allura-[a-z0-9-]+$).
2. Curator Pipeline — proposes, never decides.
A service reads raw traces, finds patterns and learnings, and emits proposed Insights. It cannot create active knowledge. Its only output is a candidate sitting in an approval queue.
3. Versioned Knowledge (Neo4j) — immutable nodes.
Insights are immutable. To change one, create a new Insight and link it: SUPERSEDES, DEPRECATED, or REVERTED. Never edit a node in place. Every Insight carries: summary, evidence (linked to traces), confidence, timestamp, status, group_id.
4. Approval — nothing goes active without it.
No Insight becomes active without human or policy approval. Approvals are recorded as audit events. This is the HITL gate; agents cannot promote their own knowledge.
5. Retrieval Layer — agents never touch the database.
Agents query a service, not a store. The service reads approved Insights from Neo4j, optionally pulls raw traces, supports semantic + structured queries, and returns scoped context (project + global).
6. Policy / API Layer — one controlled door.
All reads and writes go through governed endpoints enforcing project-level access, agent permissions, and audit logging.
Preferred extensions: mirror approved Insights to a human-readable system (Notion); add embedding-based similarity for dedup and retrieval.
Non-Negotiable Constraints

Do not collapse layers.
Do not allow direct writes to Neo4j without approval.
Do not treat logs as knowledge.
group_id on every read/write — missing it is a hard failure.
Postgres traces are append-only — no UPDATE/DELETE on trace rows, ever.
Neo4j versioning via SUPERSEDES — never mutate historical nodes.
DB operations go through MCP tools only — never docker exec.
allura-* namespace only — flag any roninclaw-* as drift.
Prioritize auditability, versioning, and clarity over speed.

Definition of Done (end-to-end)
The system works when this full loop runs:

An agent runs a task → activity is saved as raw traces.
The curator reads those traces → generates a proposed Insight.
The Insight appears in an approval queue.
A human or rule approves it → recorded as an audit event.
The Insight is written to Neo4j as an immutable node.
A new version links to the old one via SUPERSEDES.
A second agent runs → queries the retrieval layer → receives the approved Insight as context and uses it correctly.
Every step is logged, auditable, and reversible.

The same loop holds whether the runtime is Cowork, a Co-Clawed pair, a Team RAM harness, or a bank-audit vertical. One Brain, one governance model, many products on top.
