// ─── Configuration ──────────────────────────────────────────

export const config = {
    port: parseInt(process.env.PORT || '3000'),

    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        allowedChatIds: (process.env.TELEGRAM_ALLOWED_CHAT_IDS || '')
            .split(',')
            .filter(Boolean)
            .map(Number),
    },

    jira: {
        baseUrl: process.env.JIRA_BASE_URL || '',
        email: process.env.JIRA_EMAIL || '',
        apiToken: process.env.JIRA_API_TOKEN || '',
        projectKey: process.env.JIRA_PROJECT_KEY || 'DEV',
        pollLabel: process.env.JIRA_POLL_LABEL || 'dev-agent',
        pollIntervalMinutes: parseInt(process.env.JIRA_POLL_INTERVAL_MINUTES || '5'),
    },

    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        taskQueueUrl: process.env.TASK_QUEUE_URL || '',
        resultQueueUrl: process.env.RESULT_QUEUE_URL || '',
    },

    github: {
        defaultRepo: process.env.GITHUB_DEFAULT_REPO || 'https://github.com/Personaut/test-repository',
    },
};
