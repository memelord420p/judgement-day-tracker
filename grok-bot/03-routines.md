# Routines (full automation — cloud only)

Laptop does not need to be on. Routines run on Grok Bot’s cloud computer.

## Daily scan + site + X (production)

Paste **after** `INGEST_SECRET` is stored as a secure secret:

```
Create or replace the daily routine.

Schedule: every day at 09:00, Europe/Dublin.
Do: run the "Daily Judgment Day Scan" skill for the previous 24 hours with FULL AUTOMATION:
1) Produce schemaVersion-1 patch JSON (no invented evidence; ±15 pct unless force:true).
2) If force:true or CRITICAL threat: stop and ask me. Do not apply or tweet.
3) Else POST patch to https://judgement-day-tracker.vercel.app/api/patch with Bearer INGEST_SECRET (secure secret). Confirm ok:true.
4) Publish one short X bulletin from the draft while signed in as the brand account; include https://judgement-day-tracker.vercel.app
5) Leave a run report in this chat (API status + tweet URL).

If X session dead or API fails: post SCAN DEGRADED with reason and stop.
Never invent news or invent a successful API/tweet.
```

## Weekly digest (Monday)

```
Create a routine.

Schedule: every Monday at 10:00, Europe/Dublin.
Do: weekly digest across t800 / t1000 / skynet.
If material: optional reconciliation patch via same /api/patch rules; post a 3–5 post X thread only if non-CRITICAL and no force:true, else ask me.
If ALL QUIET: one quiet bulletin + set_meta patch via API.
Deliverable: digest in chat + links to tweet(s) + API result.
```

## Managing routines

Bot → View conversation details → Routines → test, pause, inspect run history.
