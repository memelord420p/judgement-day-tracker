# Future: Grok Bot write-back MCP (optional)

When you outgrow copy-paste patches, host a tiny MCP server Grok Bot can call.

## Suggested tools

| Tool | Input | Behavior |
|------|-------|----------|
| `get_tracker_state` | — | Return current state JSON |
| `validate_patch` | patch object | Schema + ±15 guardrails |
| `apply_patch` | patch object, `dryRun?` | Same as `tools/apply-patch.js` |
| `list_pending_posts` | — | From `pendingPosts` |
| `publish_post` | postId | Only if `postingMode=auto` or approved token |

## Deployment sketch

- Cloudflare Worker / Vercel serverless wrapping the apply-patch logic
- Auth: bearer token in Grok custom connector headers
- After apply: write `data/tracker-state.json` via GitHub API or Vercel Blob, then invalidate cache

## Why wait

MVP works today with Grok Bot routines + manual `apply-patch` + `vercel --prod`. Build this MCP when daily patches become annoying.
