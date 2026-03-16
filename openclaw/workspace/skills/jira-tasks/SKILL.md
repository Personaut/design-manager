---
name: jira-tasks
description: Create and manage Jira tickets for the dev pipeline. Activate when creating tasks, stories, or bugs that should be built by the dev agent.
metadata: { "openclaw": { "emoji": "🎫" } }
---

# Jira Tasks Skill

Create Jira tickets that the automated dev pipeline will pick up and build.

## When to Activate

- User asks to create a Jira ticket, task, story, or bug
- User says "file a ticket for..." or "create a task to..."
- User wants something built by the dev agent
- After writing user stories that should be dispatched to engineering

## How the Dev Pipeline Works

The dev agent pipeline polls Jira every 15 minutes looking for issues that match:

```
Project: PRODUCT
Label: ai-dev
Status: To Do, Open, Backlog, or Proposed
Resolution: Unresolved
```

**The magic label is `ai-dev`.** Any ticket in the PRODUCT project with this label and an open status gets automatically:

1. Picked up by the Jira Poller Lambda
2. Sent to the Dev Manager for planning
3. Coded by the Coder Agent
4. Reviewed by the Reviewer Agent
5. PR created on GitHub

## Creating a Ticket via Jira API

Read credentials from `credentials.json` in workspace, then:

```bash
curl -X POST "https://zivia.atlassian.net/rest/api/3/issue" \
  -H "Authorization: Basic $(echo -n 'email:apiToken' | base64)" \
  -H "Content-Type: application/json" \
  -d '{
    "fields": {
      "project": {"key": "PRODUCT"},
      "summary": "Clear, actionable title",
      "description": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{
            "type": "text",
            "text": "Detailed description with acceptance criteria"
          }]
        }]
      },
      "issuetype": {"name": "Task"},
      "labels": ["ai-dev"]
    }
  }'
```

## Critical Rules

### ALWAYS include the `ai-dev` label
Without this label, the dev pipeline will NOT pick up the ticket. This is the trigger.

### Write clear descriptions
The dev agent reads the description to understand what to build. Include:
- What to create or change
- Which repository (e.g., Personaut/test-repository)
- Specific file paths if relevant
- Acceptance criteria — what does "done" look like?
- Edge cases to handle

### Use the right issue type
- **Task** — general development work
- **Story** — user-facing feature
- **Bug** — something broken that needs fixing

### Good ticket example
```
Summary: Add dark mode toggle to settings page

Description:
Add a dark mode toggle switch to the settings page in Personaut/test-repository.

Requirements:
- Toggle switch in the top-right of the settings section
- Saves preference to localStorage
- Applies dark theme CSS variables immediately
- Default: follow system preference (prefers-color-scheme)

Acceptance Criteria:
- Toggle switches between light and dark mode instantly
- Preference persists across page reloads
- Respects system-level dark mode setting on first visit

Labels: ai-dev
```

### Bad ticket example
```
Summary: Make it look better
Description: The app needs improvement.
```
This gives the dev agent nothing to work with. Be specific.

## After Creating a Ticket

- The poller checks every 15 minutes, so there can be a short delay
- Once picked up, the pipeline runs autonomously: plan → code → review → PR
- Results appear as PRs on GitHub with labels `dev-agent` and `automated`
- Total pipeline time is usually under 2 minutes

## Checking Status

To see if a ticket was picked up, check recent PRs:
- Repository: Personaut/test-repository
- Look for PRs from the dev-agent bot
- Branch naming: `dev-agent/{task-id}`
