# Judgment Day Watch — Grok Bot Setup

Paste-ready playbook so **Grok Bot** (not a custom xAI API) monitors news, drafts tracker patches, and posts to X with approval.

## Architecture (future-proof)

```
X / web news ──► Grok Bot (skills + routines)
                      │
                      ├─► chat briefing (always)
                      ├─► patch JSON  → tools/apply-patch.js → data/tracker-state.json → Vercel site
                      └─► social draft → (approve) → posting MCP → X
```

No custom API required for MVP. Later you can add a custom MCP that runs `apply-patch` or writes `tracker-state.json` directly.

## One-time setup checklist

1. **Create Bot** in Grok Bot → New → Create new agent  
2. **Edit Profile** using [`01-bot-profile.md`](01-bot-profile.md)  
3. **Connect X** → Settings → Plugins / Connectors → X for Grok Bot (read: search, timeline, mentions, trends)  
4. **(Optional write)** Add a posting MCP at [grok.com/connectors](https://grok.com/connectors) (OpenTweet, Blotato, or your own) — official X connector cannot post  
5. Run the **first scan** manually using [`02-skill-daily-scan.md`](02-skill-daily-scan.md)  
6. Save it as a **skill**, then create the **routine** from [`03-routines.md`](03-routines.md)  
7. Keep **approve-before-post** until the voice is solid  
8. When a patch looks good: save it under `data/patches/`, run apply-patch, redeploy (or later: MCP auto-apply)

## Files in this folder

| File | Purpose |
|------|---------|
| `01-bot-profile.md` | Name, job, voice, hard rules |
| `02-skill-daily-scan.md` | Daily monitoring skill + exact patch output format |
| `03-routines.md` | Schedules (daily / weekly) |
| `04-skill-social-post.md` | X post / thread drafting skill |
| `05-connectors.md` | X read + write MCP + future site write-back |
| `06-site-update-protocol.md` | How patches become live on Vercel |
| `07-future-mcp.md` | Optional write-back MCP when you outgrow paste |

## Canonical data

- Live site state: `../data/tracker-state.json`
- Schema: `../data/schema/tracker-state.schema.json`
- Example patch: `../data/patches/example-daily-patch.json`
- Apply tool: `../tools/apply-patch.js`

## Guardrails (do not relax)

- Never invent URLs or headlines
- Never jump a subcategory more than **+15** without `force:true` + strong evidence
- Never claim Judgment Day is happening / imminent as fact
- Separate **film lore** from **real tech**
- Social posts require approval until you change `postingMode` in state
