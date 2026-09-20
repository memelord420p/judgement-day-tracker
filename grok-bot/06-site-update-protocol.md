# Site update protocol

## Source of truth

`data/tracker-state.json` drives the Vercel site (`index.html` fetches it on load).

## Happy path (manual, safe)

1. Grok Bot daily routine posts briefing + patch JSON in chat  
2. You review evidence + score deltas  
3. Save JSON to `data/patches/patch_YYYY-MM-DD_daily.json`  
4. Dry-run:

```bash
node tools/apply-patch.js data/patches/patch_YYYY-MM-DD_daily.json --dry-run
```

5. Apply:

```bash
node tools/apply-patch.js data/patches/patch_YYYY-MM-DD_daily.json
```

6. Deploy to Vercel (CLI or git push once the repo is connected):

```bash
vercel --prod
```

7. Approve/copy the drafted X post (or send via posting MCP)

## Pending social posts

`draft_social_post` ops land in `pendingPosts[]` on state after apply. Clear or mark them after publishing (future MCP can do this).

## Auto path (later)

Grok Bot → custom MCP `apply_patch` → Blob/Git update → site CDN refresh. Keep `requiresApproval` until trusted.

## Patch op reference

| op | Effect |
|----|--------|
| `prepend_headline` | Newest headline first (cap 20) |
| `set_subcat_pct` | Update subcategory % (±15 unless `force`) |
| `set_milestone` | Toggle done/partial |
| `set_subcat_desc` | Rewrite subcategory blurb |
| `recompute_overall` | Average of subcategory pcts |
| `set_overall` | Set overall directly (use when hand-tuned) |
| `set_threat` | Threat badge |
| `set_meta` | Scan timestamps / labels |
| `draft_social_post` | Queue post; does not publish |
| `set_social_channel` | Fill handle/url/status when accounts exist |

## Rollback

Keep prior `tracker-state.json` in git history or copy to `data/backups/` before apply.
