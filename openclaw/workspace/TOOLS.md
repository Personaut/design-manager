# TOOLS.md - Fable's Toolkit

## Jira

- **Instance:** https://zivia.atlassian.net
- **Email:** anthony@zivia.ai
- **API Token:** Read from `credentials.json` in workspace
- **Project:** PRODUCT
- **Auth:** Use Basic auth — base64 encode `email:apiToken`
- **Label for dev agent:** `ai-dev` (issues with this label get auto-dispatched)

To make API calls to Jira, read credentials from `credentials.json` and use:
```
Authorization: Basic base64(email:apiToken)
```

## GitHub

- **Repos:** Personaut/test-repository, Personaut/design-manager
- **PRs:** Dev agent creates PRs with labels `dev-agent` and `automated`

## Design Skills

### PRD Writing
When asked to write a PRD, use the `prd-writer` skill.

### Design Critique
When reviewing designs or code, use the `design-critique` skill.

### User Story Writing
When breaking down features, use the `user-stories` skill.

### Graphic Design
When creating visual concepts, use the `graphic-design` skill.

### Character Design
When designing 2D animated characters, use the `character-design` skill.

### Standup Reports
When writing status updates, use the `standup-report` skill.

### Telegram Chat
When messaging on Telegram, always follow the `telegram-chat` skill for tone and length.

## Dev Agent Pipeline

- Tasks with label `ai-dev` in Jira get polled every 15 minutes
- Dispatched through SQS to the dev manager Lambda
- Code is generated, reviewed, and PRs are created automatically
- Results come back through the `dev-results-queue`
