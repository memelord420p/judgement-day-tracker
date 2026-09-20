# Full automation — laptop can be off

Grok Bot runs on **Cursor’s cloud computer**. Routines keep running with your laptop closed.
The website updates when the Bot POSTs patches to Vercel (which commits GitHub). X updates when the Bot posts while signed in as the brand account.

```
Grok Bot cloud (09:00 Dublin routine)
    │
    ├─ scan X / news
    ├─ build patch JSON
    ├─ POST https://judgement-day-tracker.vercel.app/api/patch
    │     Authorization: Bearer $INGEST_SECRET
    │         → writes data/tracker-state.json on GitHub
    │         → site /api/state updates (no laptop)
    └─ post bulletin on X (brand session on cloud browser)
```

You do **not** need to give Grok Bot raw GitHub repo access. `/api/patch` already has `GITHUB_TOKEN` on Vercel.

## One-time setup (in Grok Bot)

### 1) Store the ingest secret (never put it in normal chat)

1. Open **Judgment Day Watch**
2. Ask it to store a secure secret named `INGEST_SECRET` (use the secure secret / masked credential UI — not the chat transcript)
3. Paste the value from your Mac:

```bash
cat /Users/saltwives/Documents/Code/Judgement_Day_Tracker/.ingest_secret
```

### 2) Paste this enable message

```
Enable FULL AUTOMATION for Judgment Day Tracker. Laptop will often be offline — you run on the cloud computer only.

Secrets:
- You already have (or will receive via secure secret request) INGEST_SECRET. Never echo it back in chat.

After every Daily Judgment Day Scan:
1) Write the schemaVersion-1 patch JSON.
2) If any op has force:true OR threat becomes CRITICAL: stop and ask me before applying or tweeting.
3) Otherwise AUTOMATICALLY:
   a) POST the patch to https://judgement-day-tracker.vercel.app/api/patch
      Headers: Authorization: Bearer <INGEST_SECRET>, Content-Type: application/json
      Body: the patch JSON
      Use curl/terminal on your cloud computer. Confirm HTTP 200 and ok:true.
   b) While signed in as the brand X account on your cloud browser, publish the short bulletin post from draft_social_post (one post, not a spam thread). Link https://judgement-day-tracker.vercel.app
4) Post a short run report in this chat: what changed, API result, tweet URL or “not posted”.

Update the "Daily Judgment Day Scan" skill with these rules.
Replace the daily routine with:

Schedule: every day at 09:00, Europe/Dublin.
Do: run Daily Judgment Day Scan with full automation (API patch + X bulletin) as above.
If X session expired or API 401/500: report SCAN DEGRADED and stop — do not invent success.
Never: use force:true without my OK; never claim Judgment Day is imminent as fact.

Also set social.channels.x.postingMode conceptually to auto for routine bulletins.
Save skills. Confirm next routine run time.
```

### 3) Optional GitHub plugin

Only needed if you want the Bot to open PRs by hand. **Not required** for site sync — `/api/patch` is enough.

## Verify (once)

After the next routine (or a manual “run Daily Judgment Day Scan with full automation now”):

1. Chat shows API `ok: true`
2. https://judgement-day-tracker.vercel.app/api/state shows fresh `lastUpdated` / `lastScanAt`
3. Brand X account has the bulletin

## Rollback

Pause the routine in Bot → View conversation details → Routines. Site keeps last good state.
