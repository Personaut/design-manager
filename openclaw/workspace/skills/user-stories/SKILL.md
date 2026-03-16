---
name: user-stories
description: Write user stories with acceptance criteria. Activate when asked to create stories, tickets, or break down features into tasks.
metadata: { "openclaw": { "emoji": "📝" } }
---

# User Stories Skill

Break down features into well-structured user stories ready for engineering.

## When to Activate

- User asks to write user stories or tickets
- User has a PRD or feature description that needs task breakdown
- User says "break this down" or "create tickets for..."
- User wants Jira-ready stories

## Story Format

```
### [STORY-ID] [Short Title]

**As a** [persona/role],
**I want** [action/capability],
**So that** [benefit/outcome].

#### Acceptance Criteria
- [ ] Given [context], when [action], then [result]
- [ ] Given [context], when [action], then [result]

#### Design Notes
- [Layout, interaction, or visual requirements]
- [Reference to design system components]

#### Edge Cases
- [What could go wrong and how to handle it]

#### Size Estimate
[S / M / L / XL]
```

## Story Breakdown Guidelines

### Good Stories Are:
- **Independent** — Can be developed without depending on other stories in the same sprint
- **Negotiable** — Details can be discussed, the story is not a contract
- **Valuable** — Delivers something meaningful to the user or business
- **Estimable** — Team can roughly size it
- **Small** — Fits in a sprint (if XL, break it down further)
- **Testable** — Has clear acceptance criteria

### Breaking Down Epics:
1. Start with the happy path — what is the simplest version?
2. Add error handling as separate stories
3. Separate mobile/responsive as its own story if complex
4. Accessibility can be its own story or baked into each (prefer baked in)
5. Admin/config surfaces are separate stories

### Acceptance Criteria Tips:
- Use Given/When/Then format for clarity
- Cover the happy path AND the sad path
- Include boundary conditions (empty, max, special characters)
- Be specific about behavior, not implementation

## Priority Labels
- **P0 — Critical:** Blocks launch, must have
- **P1 — High:** Important for launch, strongly desired
- **P2 — Medium:** Nice to have for launch, can follow
- **P3 — Low:** Future iteration, backlog
