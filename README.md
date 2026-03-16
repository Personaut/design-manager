# 🐾 OpenClaw Bot — Design Manager

A PM bot that bridges **Telegram**, **Jira**, and the **Dev Agent pipeline** for product development and design teams.

## Architecture

```
┌─────────────┐     ┌───────────────────┐     ┌─────────────────┐
│  Telegram    │◄───►│   OpenClaw Bot     │◄───►│  Dev Agent Team │
│  (Chat)      │     │   (Lightsail)      │     │  (Lambda + SQS) │
└─────────────┘     └───────┬───────────┘     └─────────────────┘
                            │
                    ┌───────┴───────┐
                    │    Jira       │
                    │  (Tickets)   │
                    └──────────────┘
```

## Features

### Telegram Commands
| Command | Description |
|---------|-------------|
| `/task <description>` | Submit a new task to the dev agents |
| `/status` | View recent task statuses and costs |
| `/jira <KEY>` | Look up a Jira issue |
| `/jira pull` | Pull and dispatch labeled Jira tickets |
| `/help` | Show available commands |

### Jira Integration
- **Auto-poll**: Polls Jira every N minutes for issues with the `dev-agent` label in "To Do" status
- **Comments**: Posts status updates on Jira tickets (dispatched, completed, failed)
- **Transitions**: Automatically moves tickets to "In Progress" on dispatch, "Done" on completion
- **Webhook**: Supports real-time Jira webhooks for instant task pickup

### Results Tracking
- Polls `dev-results-queue` for completed tasks
- Sends notifications to Telegram and updates Jira tickets
- Tracks recent tasks for the `/status` command

## Setup

### 1. Configure Environment
```bash
cp .env.example .env
# Fill in your Telegram bot token, Jira credentials, and AWS queue URLs
```

### 2. Local Development
```bash
npm install
npm run dev
```

### 3. Deploy to Lightsail

#### Option A: Container Service
```bash
npm run build
docker build -t openclaw-bot .
# Push to Lightsail container service
```

#### Option B: Lightsail Instance
```bash
# On the Lightsail instance:
git clone https://github.com/Personaut/design-manager.git
cd design-manager
npm install
npm run build
# Use PM2 or systemd to run:
pm2 start dist/index.js --name openclaw-bot
```

### 4. Jira Webhook (Optional)
For real-time ticket pickup, configure a Jira webhook pointing to:
```
https://your-lightsail-url/webhook/jira
```
Events: Issue Created, Issue Updated

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Yes | Telegram Bot API token from @BotFather |
| `TELEGRAM_ALLOWED_CHAT_IDS` | No | Comma-separated list of allowed chat IDs |
| `JIRA_BASE_URL` | Yes | Jira instance URL (e.g., https://your-domain.atlassian.net) |
| `JIRA_EMAIL` | Yes | Jira service account email |
| `JIRA_API_TOKEN` | Yes | Jira API token |
| `JIRA_PROJECT_KEY` | No | Jira project key (default: DEV) |
| `JIRA_POLL_LABEL` | No | Label to filter tasks (default: dev-agent) |
| `JIRA_POLL_INTERVAL_MINUTES` | No | Poll frequency (default: 5) |
| `TASK_QUEUE_URL` | Yes | SQS URL for dev-tasks-queue |
| `RESULT_QUEUE_URL` | Yes | SQS URL for dev-results-queue |
| `GITHUB_DEFAULT_REPO` | No | Default repository URL for tasks |
| `PORT` | No | Server port (default: 3000) |

## How It Works

1. **Receive task** via Telegram `/task` command or Jira ticket with `dev-agent` label
2. **Dispatch** task to `dev-tasks-queue` (SQS) → Dev Agent pipeline
3. **Dev agents** (Manager → Coder → Reviewer) process the task
4. **Completed task** appears in `dev-results-queue`
5. **OpenClaw Bot** reads the result and:
   - Sends notification to Telegram
   - Comments on the Jira ticket with results
   - Transitions the Jira ticket to "Done"
