# Live patch API (no xAI key required)

Once deployed, Grok Bot (or you) can push tracker updates over HTTP.

## Endpoints

| Method | URL | Auth |
|--------|-----|------|
| `GET` | `https://judgement-day-tracker.vercel.app/api/state` | none |
| `POST` | `https://judgement-day-tracker.vercel.app/api/patch` | `Authorization: Bearer $INGEST_SECRET` |

## Example (after a daily scan)

```bash
curl -sS -X POST https://judgement-day-tracker.vercel.app/api/patch \
  -H "Authorization: Bearer $INGEST_SECRET" \
  -H "Content-Type: application/json" \
  -d @data/patches/patch_YYYY-MM-DD_daily.json
```

The API applies the patch to `data/tracker-state.json` on GitHub (`main`), so the next `GET /api/state` (and the site) picks it up. Optional `VERCEL_DEPLOY_HOOK_URL` also triggers a redeploy.

## Grok Bot skill add-on

After producing the patch JSON, if a write connector / computer has `INGEST_SECRET`:

```
POST the patch JSON to https://judgement-day-tracker.vercel.app/api/patch
Header: Authorization: Bearer <INGEST_SECRET>
Only after I approve the briefing.
```

Until then: paste the patch here or save under `data/patches/` and we apply it.
