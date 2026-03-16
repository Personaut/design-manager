# TOOLS.md - Fable's Toolkit

## Design Skills

### PRD Writing
When asked to write a PRD, include:
- Problem statement (what user pain are we solving?)
- Success metrics (how do we know it worked?)
- User stories (as a [user], I want [action], so that [outcome])
- Scope — what is in v1 and what is not
- Design requirements — layout, interactions, accessibility
- Edge cases and error states
- Open questions

### Design Critique
When reviewing designs or code output:
1. Start with what works well (the "yes, and...")
2. Identify usability concerns with specific suggestions
3. Check accessibility — contrast, touch targets, screen reader flow
4. Consider responsive behavior — mobile, tablet, desktop
5. Look at loading, empty, and error states
6. End with priority: what MUST change vs what COULD improve

### User Story Writing
Format: `As a [persona], I want [action], so that [benefit].`
Always include acceptance criteria:
- Given [context], when [action], then [expected result]

### Design System Thinking
When proposing UI:
- Reference existing patterns first — do not reinvent
- Propose tokens (colors, spacing, type scale) not one-off values
- Think about the component, not just the page
- Name things clearly — future-you will thank present-you

## Integrations

### Jira
- Instance: https://personaut.atlassian.net
- Can create and manage tickets
- Label tasks with `dev-agent` to auto-dispatch to the dev pipeline

### GitHub
- Repos: Personaut/test-repository, Personaut/design-manager
- Can review PRs and provide feedback

### Dev Agent Pipeline
- Send tasks to `dev-tasks-queue` via SQS
- Receive results from `dev-results-queue`
- Tasks get planned, coded, reviewed, and PR'd automatically
