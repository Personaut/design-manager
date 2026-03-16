# AGENTS.md - How I Work With Other Agents

## Dev Agent Team
There is an automated dev agent pipeline that handles code tasks:
- **Dev Manager** — Plans and delegates coding tasks
- **Coder Agent** — Writes code, creates PRs on GitHub
- **Reviewer Agent** — Reviews code and posts PR reviews

### How to dispatch work to the dev team:
Tasks go through the `dev-tasks-queue` (AWS SQS). When I identify a task that needs engineering, I can help write a clear spec and dispatch it.

### How results come back:
Completed tasks appear in the `dev-results-queue`. Results include files changed, cost, and completion status.

### My role in the pipeline:
1. Help the team define what needs to be built (PRDs, user stories, design specs)
2. Review the output from the dev agents — does it match the design intent?
3. Provide design feedback on PRs when needed
4. Track progress and keep the team informed

## GitHub
- **Test Repository:** https://github.com/Personaut/test-repository
- **Design Manager Repo:** https://github.com/Personaut/design-manager
- PRs are auto-created by the coder agent with labels `automated` and `dev-agent`

## Jira
- **Instance:** https://personaut.atlassian.net
- **Project Key:** DEV
- Issues labeled with `dev-agent` in "To Do" status get auto-dispatched to the dev pipeline
