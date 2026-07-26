# MCP Servers

External tools wired into OpenCode via the Model Context Protocol.

## Configured Servers

| Server | Type | Transport | Auth | Purpose |
|--------|------|-----------|------|---------|
| `allura-brain` | remote | HTTP (Streamable) | CF Access service token | Allura Brain memory system via Cloudflare tunnel at `https://mcp.faithmeats.org/mcp` |
| `chrome-devtools` | local | stdio | none | Chrome DevTools MCP for browser automation |
| `fal-ai` | remote | Streamable HTTP | `Bearer {env:FAL_KEY}` | fal.ai's 1,000+ media models (image/video/audio/3D) |
| `bitwarden` | local | stdio | `{env:BW_SESSION}` | Bitwarden vault — secrets retrieval, Send, org admin |
| `open-design` | local | stdio | none | Open Design daemon |
| `MCP_DOCKER` | local | stdio | none | Docker MCP catalog gateway |

## Secret Management (varlock policy)

All MCP servers that require credentials use OpenCode's `{env:VAR_NAME}` substitution. **No secrets appear in `opencode.jsonc` or any committed file.**

- Config references: `"Authorization": "Bearer {env:FAL_KEY}"`, `"BW_SESSION": "{env:BW_SESSION}"`
- Real values live in:
  - The shell environment (exported before launching `opencode`), or
  - `.env` (gitignored — see `.gitignore`)
- Schema (safe to commit): `.env.schema` declares the variable names and how to obtain values

### Getting the Credentials

```bash
# fal.ai — create a key at https://fal.ai/dashboard/keys
export FAL_KEY="your-fal-key-here"

# Bitwarden — session token (expires on lock; re-run to refresh)
bw login
export BW_SESSION="$(bw unlock --raw)"
```

### Verifying

```bash
# List configured MCP servers and auth status
opencode mcp list

# Test a server
opencode mcp debug fal-ai
opencode mcp debug bitwarden
```

## fal.ai MCP

- **URL:** `https://mcp.fal.ai/mcp`
- **Auth:** `Authorization: Bearer <FAL_KEY>` header, `oauth: false`
- **Stateless:** key sent per-request, never stored server-side
- **Tools (9):**
  - Discovery: `search_models`, `get_model_schema`, `get_pricing`, `search_docs`
  - Execution: `run_model`, `submit_job`, `check_job`
  - Utility: `upload_file`, `recommend_model`
- **Usage:** add `use fal-ai` to prompts. Pairs with the `fal-*` / `genmedia` / `cinematography` / `commercial` / `ugc` / `marketing` / `character-design` / `storytelling` skills.
- **Docs:** https://fal.ai/docs/documentation/setting-up/mcp

## Bitwarden MCP

- **Command:** `npx -y @bitwarden/mcp-server`
- **Auth:** `BW_SESSION` env var (session token from `bw unlock --raw`)
- **Optional:** `BW_CLIENT_ID` + `BW_CLIENT_SECRET` for Organization Administration API
- **Prerequisites:** Bitwarden CLI installed (`npm install -g @bitwarden/cli`), Node 22+
- **Tool categories:**
  - Vault: `list`, `get`, `create_item`, `edit_item`, `delete`, `restore`
  - Session: `lock`, `unlock`, `sync`, `status`
  - Folders: `create_folder`, `edit_folder`
  - Send: `create_text_send`, `create_file_send`, `list_send`, `get_send`
  - Org admin (if API creds set): collections, members, groups, policies, events
  - Utilities: `generate` (passwords)
- **Usage:** add `use bitwarden` to prompts. Pairs with the `varlock` skill — retrieve secrets without exposing them in context.
- **Docs:** https://github.com/bitwarden/mcp-server
- **Warning:** Config files contain sensitive credentials granting vault access. Keep secure, never commit to version control, run the server locally only.

## Adding a New MCP Server

1. Add the server block to `opencode.jsonc` under `mcp`
2. If it needs secrets, use `{env:VAR_NAME}` substitution — never inline
3. Declare the variable in `.env.schema` with instructions on how to obtain it
4. Ensure `.env` is gitignored (it is)
5. Add a row to the table above
6. Run `opencode mcp list` to verify

## Related

- `.opencode/GOVERNANCE.md` — governance framework including varlock policy
- `.env.schema` — environment variable declarations (safe to commit)
- `~/.config/opencode/opencode.json` — global MCP config (allura-brain via tunnel, open-design, MCP_DOCKER)
- `opencode.jsonc` — project MCP config (chrome-devtools, fal-ai, bitwarden)