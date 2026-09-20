# Connectors (no custom xAI API)

## Required for MVP — X read

1. Open Grok Bot → connect **X** (announced as X connector / X for Grok Bot plugin)
2. Sign in with the brand account when you have it (or your personal account for testing)
3. Confirm the Bot can: search posts, read timeline, check mentions, pull trends
4. Paid Grok Bot users may receive starter X API credits via this flow — still not “you writing API code”

**Important:** this connector is **read-only**. It does not publish.

## Required for posting — write MCP

Add a custom MCP at https://grok.com/connectors → New Connector → Custom.

Options (pick one when ready):

| Service | Role |
|---------|------|
| OpenTweet MCP | Post / thread / schedule to X without hand-rolling X API apps |
| Blotato MCP | Multi-platform publish/schedule |
| Your MCP later | Preferred long-term: validate patch + apply to tracker-state + optional post |

Until a write connector exists: Grok Bot only **drafts**; you paste/post manually or run apply-patch locally.

## Future-proof: site write-back MCP (recommended next build)

Expose tools:

1. `get_tracker_state` → returns current `data/tracker-state.json`
2. `validate_patch` → schema + ±15 guardrails
3. `apply_patch` → same semantics as `tools/apply-patch.js`
4. `queue_social_post` / `publish_social_post` → respects `postingMode`

Host that MCP on the public internet; point Grok Bot at it. Then routines can update the live site with approval boundaries — still no direct xAI API usage in this repo.

## Google Drive / Sheets fallback

If you want zero deploy friction temporarily:

- Bot writes the patch JSON into a Drive folder via Drive connector
- You (or a tiny sync job later) apply it with `node tools/apply-patch.js`

## Security

- Never put Vercel/GitHub tokens in a **shared** Bot link
- Keep approval on for publish + force score jumps
- Rotate any MCP bearer keys if a Bot share link was public
