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

---

## Writing Great Requirements

The quality of what gets built depends entirely on the quality of what you write. The dev agent is literal — it builds exactly what you describe. Vague requirements = vague results.

### Issue Hierarchy

```
Epic (big initiative, weeks/months)
  └─ Feature (distinct capability within the epic)
       └─ Story (user-facing behavior, 1-3 days)
            └─ Task (technical work, hours)
            └─ Bug (something broken)
```

---

### Epics

Epics are large bodies of work that span multiple sprints. They represent a business objective or major capability.

**Template:**
```
Summary: [Verb] [What] for [Who]

Description:
## Vision
What does the world look like when this epic is done?

## Business Context
- Why are we doing this now?
- What problem does it solve?
- Who benefits and how?

## Success Metrics
- [Measurable outcome 1]
- [Measurable outcome 2]

## Scope
### In Scope
- [Capability 1]
- [Capability 2]

### Out of Scope
- [What we are NOT building]

## Key Dependencies
- [External system, team, or decision needed]
```

**Good Epic Example:**
```
Summary: Build Customer Onboarding Flow

Vision:
New users can sign up, configure their workspace, and start using the
product within 5 minutes — no support tickets needed.

Business Context:
- 40% of signups abandon before completing setup
- Support handles 200+ onboarding tickets/month
- Competitors offer self-serve onboarding

Success Metrics:
- Reduce time-to-first-value from 45min to under 5min
- Cut onboarding support tickets by 60%
- Achieve 80%+ completion rate on signup flow

Scope:
In: Email signup, workspace creation, team invites, guided tour
Out: SSO/SAML, billing integration, mobile onboarding
```

---

### Features

Features are distinct capabilities that deliver part of an epic. They should be demo-able.

**Template:**
```
Summary: [Feature Name] — [One-line what it does]

Description:
## What
What does this feature do? Describe the capability in plain language.

## Why
What user problem does this solve? Link to the parent epic.

## User Flow
1. User does [action]
2. System responds with [behavior]
3. User sees [result]

## Requirements
- [ ] [Specific requirement 1]
- [ ] [Specific requirement 2]
- [ ] [Specific requirement 3]

## Design Constraints
- [Performance, accessibility, platform requirements]

## Dependencies
- [APIs, services, or other features needed]
```

**Good Feature Example:**
```
Summary: Team Invite System — Let workspace owners invite members via email

What:
Workspace owners can invite team members by entering email addresses.
Invitees receive an email with a one-click join link that adds them to
the workspace with a default role.

Why:
Part of the Onboarding Epic. Users need to bring their team in quickly.
Currently requires manual account creation by an admin.

User Flow:
1. Owner clicks "Invite Team" from workspace settings
2. Enters one or more email addresses (comma-separated)
3. Selects a role (Member or Admin)
4. Clicks Send — invitees get an email within 60 seconds
5. Invitee clicks the link → lands on workspace with role assigned

Requirements:
- Max 20 invites per batch
- Duplicate emails are silently skipped
- Pending invites expire after 7 days
- Owner can resend or revoke pending invites
- Works for existing users and new signups

Design Constraints:
- Email must render in Gmail, Outlook, and Apple Mail
- Invite link must be single-use
- Must not expose workspace details to non-invitees
```

---

### Stories

Stories describe user-facing behavior. They answer: "As a user, what can I do and why?"

**Template:**
```
Summary: [Short, specific title]

As a [persona],
I want [action/capability],
So that [benefit/outcome].

Acceptance Criteria:
- Given [context], when [action], then [result]
- Given [context], when [action], then [result]
- Given [context], when [action], then [result]

Edge Cases:
- What happens when [unusual condition]?
- What happens when [error state]?

Design Notes:
- [Layout, visual, or interaction details]

Size: [S / M / L]
```

**Good Story Example:**
```
Summary: Resend expired team invite

As a workspace owner,
I want to resend an invitation that has expired,
So that I don't have to re-enter the email and role.

Acceptance Criteria:
- Given a pending invite that expired, when owner clicks "Resend",
  then a new email is sent with a fresh 7-day link
- Given a resent invite, when the old link is clicked,
  then it shows "This invite has expired" with a request-new-invite option
- Given an invite was already accepted, then "Resend" button is hidden

Edge Cases:
- Invitee changed their email → owner must create a new invite
- Invitee's account was deactivated → show error "Cannot invite deactivated user"

Design Notes:
- "Resend" button appears on expired rows in the invite table
- Show toast confirmation: "Invite resent to sarah@example.com"

Size: S
```

**Bad Story Example:**
```
Summary: Fix invites
Description: Invites don't work right sometimes. Make them better.
```
This is useless. No persona, no criteria, no specifics.

---

### Tasks

Tasks are technical work that may not be user-visible. They support stories or system health.

**Template:**
```
Summary: [Specific technical action]

Description:
## What
What needs to be done technically?

## Context
Why is this task needed? Which story or feature does it support?

## Implementation Notes
- [Technical approach or constraints]
- [Files, services, or APIs involved]
- [Repository: Personaut/repo-name]

## Done When
- [ ] [Verifiable completion criteria 1]
- [ ] [Verifiable completion criteria 2]
```

**Good Task Example:**
```
Summary: Add rate limiting to invite API endpoint

Context:
Supports the Team Invite feature. Without rate limiting, a compromised
account could spam invites.

Implementation Notes:
- Repository: Personaut/api-server
- Endpoint: POST /api/v1/workspaces/:id/invites
- Limit: 50 requests per hour per workspace
- Use Redis sliding window counter
- Return 429 with Retry-After header when exceeded

Done When:
- Rate limiter is applied to the invite endpoint
- Exceeding the limit returns 429 with correct Retry-After
- Existing tests pass, new test covers rate limit scenario
- Limit is configurable via environment variable
```

---

### Bugs

Bugs describe broken behavior. The key is reproducibility.

**Template:**
```
Summary: [What is broken] — [Where]

Description:
## Current Behavior
What happens now? (Be specific — include error messages)

## Expected Behavior
What should happen instead?

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. Observe: [What goes wrong]

## Environment
- Browser/OS: [e.g., Chrome 120, macOS 14]
- User role: [e.g., workspace owner]
- Frequency: [Always / Intermittent / First-time only]

## Impact
- [Who is affected and how badly]

## Possible Cause (if known)
- [Hypothesis or stack trace]

Labels: ai-dev, bug
```

**Good Bug Example:**
```
Summary: Invite email shows raw HTML instead of formatted content — Gmail

Current Behavior:
Invite emails in Gmail display raw HTML tags (<h1>, <p>, etc.) instead
of rendered content. Works correctly in Apple Mail and Outlook.

Expected Behavior:
Email should render as formatted HTML in all major email clients.

Steps to Reproduce:
1. Send a team invite to a Gmail address
2. Open the email in Gmail web client
3. Observe: HTML tags are visible as plain text

Environment:
- Gmail web client (Chrome 120, macOS)
- Frequency: Always
- Affects all invite emails, not just new ones

Impact:
- All Gmail users (~60% of invitees) see broken emails
- Creates a poor first impression of the product

Possible Cause:
Content-Type header may be set to text/plain instead of text/html
```

---

### Requirements Writing Checklist

Before creating any ticket, verify:

- [ ] **Summary is specific** — Could someone understand the scope from the title alone?
- [ ] **Description has context** — Why are we doing this? What problem does it solve?
- [ ] **Acceptance criteria are testable** — Can you answer yes/no to each one?
- [ ] **Edge cases are covered** — What happens when things go wrong?
- [ ] **Scope is clear** — What is NOT included?
- [ ] **Repository is specified** — Which codebase does this affect?
- [ ] **Size is reasonable** — If it's XL, break it down further
- [ ] **Labels are set** — Include `ai-dev` for dev pipeline dispatch
