# Allura Ecosystem — Build & Test Commands

## Development
```bash
cd allura-memory
bun install
bun run dev          # Start Brain MCP server
```

## Testing
```bash
cd allura-memory
bun test             # Run all tests
bun run typecheck    # TypeScript check
bun run lint         # ESLint check
```

## Validation
```bash
cd ../factory
./validate.sh teams/penasoto    # Validate a factory team
./validate.sh teams/raleigh
./validate.sh teams/charlotte
```

## Brain Health
```bash
# Check Allura Brain connectivity
bun run scripts/check-brain.ts
```

## Project Structure
```
allura-memory/       # Brain submodule (PostgreSQL + Neo4j + MCP)
Agent-Harnesses/     # Runtime harnesses (gitignored)
factory/             # Agent team builder + governance validator
Client-Projects/     # Client workspaces
```