# ADR: RuVector Integration Boundary — RuVector Executes, Allura Governs

**Status:** Proposed / Future (Brooks, 2026-06-10 — not yet scheduled) | **Owner:** brooks-architect | **group_id:** allura-system

## Context

RuVector integration is a Phase-3 PRD item. Capturing the boundary now — before any code couples
the two — keeps the integration clean and our differentiation intact. This is a *future* ADR: it
fixes the contract line, not the implementation.

## Decision

A single, sharp division of responsibility. Neither side reaches across it.

| RuVector owns (the engine) | Allura owns (the governance) |
|---|---|
| Vector storage | Tenancy (`group_id` per ADR-001) |
| Retrieval | HITL approval / curator (Bahari) |
| Routing | Knowledge promotion |
| DAG execution | SUPERSEDES versioning |
| Circuit breakers | Append-only audit history |

**Principle (Brooksian):** depend on the *interface*, not the implementation. RuVector is a
high-performance execution substrate Allura calls; it never sees or enforces tenancy, approval, or
lineage — those stay in the Allura API layer where the CHECK constraints and HITL gate live.

## Why this matters

It keeps Allura differentiated (governance is the product, not raw vector speed) and makes any
upstream contribution to RuVector clean — we contribute execution improvements, not governance
opinions that would fork the project.

## Consequences

- **Gain:** swap or upgrade the execution engine without touching governance; clearer upstreaming.
- **Give up:** some performance ceilings we can't reach if governance must sit in front of every
  retrieval — acceptable, since auditability is the value proposition.

## Open Questions

1. Does retrieval flow Brain -> RuVector -> Brain (governance wraps every call), or does RuVector
   read a tenant-scoped projection? (Determines where the `group_id` filter is enforced.)
2. DAG execution events — do they log as append-only traces in Allura, or stay internal to RuVector?
3. Versioning: does RuVector need to be SUPERSEDES-aware, or does Allura resolve lineage before
   handing vectors down?
