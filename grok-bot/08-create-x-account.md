# Skill: Create Judgment Day Tracker X account

Grok Bot **can** create the brand X account via its cloud computer browser.
xAI docs: it uses a persistent computer; you take over only for password / 2FA / CAPTCHA / identity checks.

Also distinct: connecting the **X connector** later can auto-create an **X developer** account (API credits) — that is not the same as creating `@JudgmentDayTracker`.

## Paste this to Judgment Day Watch

```
Create the official X (Twitter) account for Judgment Day Tracker using your cloud computer browser.

Goal account:
- Suggested handle (try in order until one is free):
  1) JudgmentDayTrack
  2) JudgmentDayBot
  3) JDTrackerAI
  4) Ask me if all are taken
- Display name: Judgment Day Tracker
- Bio: Tracking how close real tech is to T-800 / T-1000 / Skynet. Live scores → https://judgement-day-tracker.vercel.app
- Location: Cyberdyne Systems (optional joke) or leave blank
- Website: https://judgement-day-tracker.vercel.app

Steps:
1) Open Agent Computer / browser and go to https://x.com/i/flow/signup
2) Prefer Sign up with email (use an inbox I control — ask me which email if unknown)
3) Fill profile fields above
4) STOP and ask me to take over for: CAPTCHA, phone/SMS verify, email code, password, passkey, or any identity check
5) After the account exists, set avatar/banner if you can (Terminator-red terminal aesthetic; no copyrighted movie stills)
6) Post a pinned intro draft for my approval (do NOT publish until I say OK):
   "SYSTEM ONLINE. Monitoring humanoid, liquid-metal, and ASI progress toward Judgment Day fiction.
Live tracker: https://judgement-day-tracker.vercel.app
#JudgmentDayTracker"
7) Return to me:
   - final handle + profile URL
   - email used
   - whether phone verify was required
   - login session status on your computer (signed in? yes/no)
   - next step: connect X connector + posting MCP

Never: invent that the account exists if signup failed; never store my password in chat; never bypass CAPTCHA/2FA yourself.
```

## After it exists

1. Tell this Cursor chat the handle (e.g. `@JudgmentDayTrack`)
2. We’ll set `social.channels.x` in `data/tracker-state.json` to `status: "live"` and redeploy
3. In Grok Bot: connect **X connector** (read) while signed in as that account
4. Add a write MCP when you want auto-posting

## Save-as-skill (optional)

```
Save as skill "Create / bootstrap Judgment Day X account".
Use when the brand X channel status is planned/missing.
Always pause for human takeover on CAPTCHA, phone, email codes, and passwords.
```
