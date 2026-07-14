---
name: allura-bitwarden-cowork-secret-provider
description: "Retrieve secrets from a Bitwarden vault for Allura cowork agents without hardcoding credentials. Uses the official Bitwarden MCP server with interactive unlock."
---

# allura-bitwarden-cowork-secret-provider

## When to Use

Use this skill when an Allura agent needs a secret (API key, token, password) that is stored in a Bitwarden vault, especially during cowork flows where multiple agents may need the same credential.

## What It Does

- Loads the Bitwarden MCP server (`@bitwarden/mcp-server`) into the MCP client.
- Calls the `bitwarden_unlock` tool when the vault is locked.
- You enter your master password in a native OS dialog; the password never crosses the MCP channel or enters the LLM context.
- Retrieves the requested credential by item name or ID.
- Feeds the credential to the next tool or environment variable without exposing it in the chat transcript.

## Required MCP Server Config

Add to your OpenCode / Claude Desktop / Codex config:

```json
{
  "mcpServers": {
    "bitwarden": {
      "command": "npx",
      "args": ["-y", "@bitwarden/mcp-server"]
    }
  }
}
```

Do **not** hardcode `BW_SESSION` in the config. Let the unlock tool create the session interactively.

## Flow

1. Agent detects a secret is needed (e.g., `FAL_KEY` for fal.ai).
2. Agent calls `bitwarden_unlock`.
3. Native password dialog appears; you enter your master password.
4. Agent calls `bitwarden_get` with the exact item name or ID.
5. Agent uses the returned credential in the next command, masked from the transcript.

## Security Rules

- Never commit `BW_SESSION`, `BW_CLIENT_ID`, `BW_CLIENT_SECRET`, or retrieved credentials to version control.
- Never paste your master password into the chat.
- Only run the Bitwarden MCP server locally.
- Use read-only / no-reveal mode for untrusted agent contexts if using `@icoretech/warden-mcp`.

## Example Prompt

"Unlock Bitwarden and get my fal.ai API key so we can edit the README images."

## Fallback

If the MCP server is not available, fall back to the `bw` CLI in the local terminal:

```bash
export BW_SESSION="$(bw unlock --raw)"
bw get item "fal.ai API Key" --session "$BW_SESSION" | jq -r '.fields[] | select(.name=="FAL_KEY").value'
```

## Related Skills

- `allura-fal-ai-image-editing` — uses the secret this skill retrieves.
