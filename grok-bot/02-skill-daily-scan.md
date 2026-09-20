# Skill: Daily Judgment Day Scan

Standing skill — Grok Bot should run this on routine **without** being reminded to tweet or gap-hunt.

## Canonical skill body (save / replace)

```
Skill: Daily Judgment Day Scan

When to use: daily routine 09:00 Europe/Dublin, or on-demand "run daily scan".

Inputs: lookback (default 24h) + standing watchlist/gap hunt (always on).

Steps:
1) Pull current scores from https://judgement-day-tracker.vercel.app/api/state (note overall + last headlines).
2) Search X + web for last lookback window AND any standing-watchlist gaps not yet on the tracker (Optimus factory numbers, Figure/BMW, EU AI Act enforcement, Robot Olympics results, liquid-metal papers, autonomous weapons field use, agentic cyber incidents, viral fails/wins).
3) Prefer primary sources. Never invent URLs or events.
4) Build dual-register findings: serious beats + comedy fails/wins (never roast injury victims).
5) Map to fighterId/subcatId. Score ±15 max unless force:true + strong evidence.
6) Write schemaVersion-1 patch (set_meta lastScanAt/Summary always). Include draft_social_post: score line + serious beat + comedy beat + site URL.
7) FULL AUTOMATION: if no force:true and threat≠CRITICAL → POST patch to https://judgement-day-tracker.vercel.app/api/patch (Authorization: Bearer INGEST_SECRET and/or X-Ingest-Secret). On ok:true, publish the bulletin from @judgementdayt brand session. Report API status + tweet URL in chat.
8) If force:true / CRITICAL / API 401/500 / X session dead → SCAN DEGRADED or NEED APPROVAL — do not fake success.

Validation: citations; dual register when material exists; gap hunt attempted; site+X sync attempted.

Output: (A) briefing ≤20 lines (B) patch JSON (C) API+tweet result line.

Never: invent news; publish before successful patch when automation is on; dump scores for comedy-only viral fails.
```

## One-shot: install / refresh this skill on the Bot

```
Replace your profile description with the standing system prompt from Judgment Day Tracker (dual register + always-on watchlist + auto patch/tweet). Then save/replace skill "Daily Judgment Day Scan" with the canonical skill body that includes: pull /api/state first, gap-hunt Optimus/Figure/BMW/EU AI Act/Robot Olympics/liquid-metal/autonomous drones/agentic cyber without being asked, dual-register bulletin, auto POST /api/patch + auto tweet @judgementdayt unless force:true or CRITICAL. Confirm the daily 09:00 Europe/Dublin routine uses this skill. Do not ask me to remind you to tweet or hunt gaps — that is default behavior.
```
