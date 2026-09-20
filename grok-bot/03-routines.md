# Routines

Create these **after** the Daily Judgment Day Scan skill works twice manually.

## Daily scan routine

Paste to Judgment Day Watch:

```
Create a routine.

Schedule: every day at 09:00, Europe/Dublin.
Do: run the "Daily Judgment Day Scan" skill for the previous 24 hours.
Deliverable: post the briefing + JSON patch in this conversation.
If data/sources unavailable: post "SCAN FAILED: <reason>" and stop. Do not invent news.
Never: publish to X, email anyone, or apply patches without my approval.
Approval boundary: all social posts and all force:true score changes require my explicit OK.
```

## Weekly threat digest routine

```
Create a routine.

Schedule: every Monday at 10:00, Europe/Dublin.
Do: summarize the week’s Judgment Day Tracker movements across t800, t1000, skynet.
Deliverable: (1) weekly digest in chat, (2) draft X thread (3–5 posts) with approvalRequired true, (3) optional patch if scores need reconciliation.
If no material news all week: digest saying ALL QUIET + one witty but non-alarmist post draft.
Never: auto-publish.
```

## Optional: mention / reply watch (later)

When you want engagement:

```
Create a routine.

Schedule: every day at 18:00, Europe/Dublin.
Do: check X mentions/search for Judgment Day Tracker, T-800 progress claims, and viral AI-doom posts relevant to our categories.
Deliverable: short triage list — ignore / reply-draft / escalate-to-score-update.
Never: reply publicly without approval.
```

## Managing routines

Bot → View conversation details → Routines → test, pause, inspect run history.
