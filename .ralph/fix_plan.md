# Allura Ecosystem — Implementation Tasks

## Phase 0: Workspace Consolidation
- [x] Move factory teams to Agent-Harnesses
- [x] Sync 28 agents to Notion Agent OS
- [x] Fix git remote (repoint to Allura-ecosystem.git)
- [x] Clean dirty git tree (brandmaker deletions, new files)
- [x] Remove sunset tools (aion, hermes, perplixica)
- [x] Update README to reflect current state
- [x] Set up .ralph/ with Allura governance

## Phase 1: Brain Stability
- [ ] Allura Brain health check (PostgreSQL + Neo4j + MCP)
- [ ] Verify append-only governance invariants
- [ ] Run factory validate.sh on all 3 teams

## Phase 2: Factory Automation
- [ ] Build-to-harness pipeline: factory spec → runnable harness
- [ ] Agent-sync for new client teams (not just TeamRam)

## Phase 3: Custom UI Shell
- [ ] Architecture decision: Aion UI clone + Hermes features
- [ ] Tech stack selection
- [ ] Sprint 0: project scaffolding