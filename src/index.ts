// ============================================================
// OpenClaw PM Bot — Design Manager
// Bridges Telegram, Jira, and the Dev Agent pipeline
// ============================================================

import 'dotenv/config';
import express from 'express';
import cron from 'node-cron';
import { TelegramService } from './telegram';
import { JiraService } from './jira';
import { SQSBridge } from './sqs-bridge';
import { ResultsPoller } from './results-poller';
import { config } from './config';

const app = express();
app.use(express.json());

// ─── Services ───────────────────────────────────────────────

const telegram = new TelegramService();
const jira = new JiraService();
const sqsBridge = new SQSBridge();
const resultsPoller = new ResultsPoller(telegram, jira);

// ─── Health Check ───────────────────────────────────────────

app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'openclaw-bot',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ─── Telegram Webhook (optional — alternative to polling) ───

app.post('/webhook/telegram', (req, res) => {
    telegram.handleWebhook(req.body);
    res.sendStatus(200);
});

// ─── Jira Webhook (for real-time ticket updates) ────────────

app.post('/webhook/jira', async (req, res) => {
    try {
        const event = req.body;
        console.log(`[Jira Webhook] Event: ${event.webhookEvent}`);

        if (event.webhookEvent === 'jira:issue_created' || event.webhookEvent === 'jira:issue_updated') {
            const issue = event.issue;
            const labels = issue.fields?.labels || [];

            if (labels.includes(config.jira.pollLabel)) {
                console.log(`[Jira Webhook] Processing ${issue.key}: ${issue.fields?.summary}`);
                await sqsBridge.submitJiraTask(issue);
                await jira.addComment(issue.key, '🤖 *OpenClaw Bot* — Task picked up and dispatched to the dev agent team.');
                await telegram.broadcast(`📋 *New Jira Task*\n\n🔑 ${issue.key}: ${issue.fields?.summary}\n🏷️ Dispatched to dev agents`);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('[Jira Webhook] Error:', error);
        res.sendStatus(500);
    }
});

// ─── Telegram Command Handler ───────────────────────────────

telegram.onCommand('/task', async (msg, args) => {
    if (!args) {
        await telegram.reply(msg, '❌ Usage: /task <description>\n\nExample: /task Add dark mode to the landing page');
        return;
    }

    const taskId = `tg-${Date.now()}`;
    await sqsBridge.submitTelegramTask({
        taskId,
        title: args.substring(0, 100),
        description: args,
        chatId: msg.chat.id,
    });

    await telegram.reply(msg, `✅ *Task Submitted*\n\n🆔 \`${taskId}\`\n📋 ${args.substring(0, 100)}\n\n_The dev agent team will start working on this shortly._`);
});

telegram.onCommand('/status', async (msg) => {
    const tasks = await resultsPoller.getRecentTasks();
    if (tasks.length === 0) {
        await telegram.reply(msg, '📊 No recent tasks found.');
        return;
    }

    const lines = tasks.map((t) =>
        `${t.status === 'completed' ? '✅' : t.status === 'failed' ? '❌' : '⏳'} \`${t.taskId}\` — ${t.title}\n   💰 $${t.cost.toFixed(4)} | ${t.status}`
    );
    await telegram.reply(msg, `📊 *Recent Tasks*\n\n${lines.join('\n\n')}`);
});

telegram.onCommand('/jira', async (msg, args) => {
    if (!args) {
        await telegram.reply(msg, '❌ Usage: /jira <PROJ-123> or /jira pull');
        return;
    }

    if (args.toLowerCase() === 'pull') {
        const count = await jira.pollAndDispatch(sqsBridge);
        await telegram.reply(msg, `🔄 Pulled ${count} task(s) from Jira.`);
        return;
    }

    // Look up a specific Jira ticket
    const issue = await jira.getIssue(args.toUpperCase());
    if (!issue) {
        await telegram.reply(msg, `❌ Issue ${args} not found.`);
        return;
    }

    await telegram.reply(msg, [
        `📋 *${issue.key}: ${issue.fields.summary}*`,
        ``,
        `📌 Status: ${issue.fields.status.name}`,
        `🏷️ Labels: ${issue.fields.labels?.join(', ') || 'none'}`,
        `👤 Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`,
        `📝 ${(issue.fields.description || 'No description').substring(0, 300)}`,
    ].join('\n'));
});

telegram.onCommand('/help', async (msg) => {
    await telegram.reply(msg, [
        `🤖 *OpenClaw Bot — Design Manager*`,
        ``,
        `*Commands:*`,
        `/task <description> — Submit a task to the dev agents`,
        `/status — View recent task statuses`,
        `/jira <KEY> — Look up a Jira issue`,
        `/jira pull — Pull and dispatch labeled Jira tickets`,
        `/help — Show this help message`,
    ].join('\n'));
});

// ─── Scheduled Jobs ─────────────────────────────────────────

// Poll Jira for new tasks every N minutes
cron.schedule(`*/${config.jira.pollIntervalMinutes} * * * *`, async () => {
    console.log('[Cron] Polling Jira for new tasks...');
    try {
        const count = await jira.pollAndDispatch(sqsBridge);
        if (count > 0) {
            await telegram.broadcast(`🔄 *Jira Poll*: Dispatched ${count} new task(s)`);
        }
    } catch (error) {
        console.error('[Cron] Jira poll failed:', error);
    }
});

// Poll SQS results queue every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
    try {
        await resultsPoller.poll();
    } catch (error) {
        console.error('[Cron] Results poll failed:', error);
    }
});

// ─── Start ──────────────────────────────────────────────────

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`\n🐾 OpenClaw Bot started on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Telegram: ${config.telegram.botToken ? 'Connected' : 'Not configured'}`);
    console.log(`   Jira: ${config.jira.baseUrl || 'Not configured'}`);
    console.log(`   SQS Task Queue: ${config.aws.taskQueueUrl ? 'Connected' : 'Not configured'}`);
    console.log(`   SQS Results Queue: ${config.aws.resultQueueUrl ? 'Connected' : 'Not configured'}\n`);
});

telegram.start();
