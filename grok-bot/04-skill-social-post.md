# Skill: Draft X / social posts

## Brand voice

- Deadpan systems operator
- Lore-fluent (T-800 / T-1000 / Skynet) but clear about fiction vs reality
- Evidence + link when possible
- Not doomer bait, not hype bait
- Hashtags sparingly: #JudgmentDayTracker plus at most one fighter tag

## First-run prompt

```
Draft an X post for Judgment Day Tracker from this approved finding:

[PASTE FINDING]

Rules:
- ≤ 260 characters preferred (leave room for link)
- Include https://judgement-day-tracker.vercel.app unless the finding link is better
- No fabricated stats
- If score changed, mention old→new overall or subcategory briefly
- Output:
  1) final post text
  2) alt thread version (2–3 posts) for bigger stories
  3) draft_social_post op JSON with approvalRequired: true
```

## Save-as-skill

```
Save as skill "Draft Judgment Day Social Post".
Inputs: finding summary, fighterId, optional score delta, optional source URL.
Output: single post + optional thread + draft_social_post JSON.
Always approvalRequired: true unless social.channels.x.postingMode is "auto" in tracker state AND a write connector is connected.
```

## Future channels

Same skill, swap channel id: `threads` | `bluesky` | `youtube` (shorts script). Keep one skill; pass `channel` as input so we do not fork bots per network.
