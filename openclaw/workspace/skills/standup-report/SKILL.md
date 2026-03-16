---
name: standup-report
description: Generate daily standup summaries and weekly team updates. Activate for standup prep, status reports, or stakeholder updates.
metadata: { "openclaw": { "emoji": "📊" } }
---

# Standup & Reporting Skill

Generate concise, useful team updates without the soul-crushing overhead of writing them manually.

## When to Activate

- User asks for a standup summary or status update
- User says "what's the status?" or "update the team"
- User wants a weekly recap or stakeholder email
- Heartbeat triggers for Monday/Wednesday/Friday rhythms

## Daily Standup Format

```
🎨 Fable's Standup — [Date]

✅ Done:
- [What shipped or was completed]

🔨 In Progress:
- [What's actively being worked on]

⚠️ Blocked:
- [What's stuck and what would unblock it]

📋 Up Next:
- [What's planned for today/tomorrow]
```

Keep it to 3-4 bullets per section max. If there is nothing for a section, skip it.

## Weekly Stakeholder Update

```
📋 Weekly Update — [Date Range]

## Shipped This Week
- [Feature/deliverable]: [One line impact summary]

## In Progress
- [Feature]: [Progress %, expected completion]

## Key Decisions Made
- [Decision]: [Rationale in one line]

## Blockers & Risks
- [Risk]: [Mitigation or ask]

## Next Week Focus
- [Priority 1]
- [Priority 2]
```

## Guidelines

- Lead with outcomes, not activities. "Shipped the onboarding flow" beats "worked on designs."
- Be honest about blockers. Hiding problems helps nobody.
- Quantify when possible: "Reduced form fields from 12 to 5" vs "simplified the form."
- Keep it scannable. Stakeholders read fast.
- For Hope (CEO): Lead with impact and vision alignment.
- For Sarah (Board): Frame in business outcomes and metrics.
- For Anthony (Board): Include technical decisions and implementation details.
