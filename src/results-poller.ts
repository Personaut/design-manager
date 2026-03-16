// ============================================================
// Results Poller — Reads dev-results-queue for completed tasks
// and sends notifications to Telegram & Jira
// ============================================================

import {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { config } from './config';
import type { TelegramService } from './telegram';
import type { JiraService } from './jira';

const sqsClient = new SQSClient({ region: config.aws.region });

interface TaskResult {
    taskId: string;
    jiraKey?: string;
    title: string;
    status: string;
    totalCostUsd?: number;
    codeArtifacts?: Array<{ filePath: string }>;
    completedAt: string;
}

// In-memory store for recent tasks (for /status command)
const recentTasks: Array<{
    taskId: string;
    title: string;
    status: string;
    cost: number;
    completedAt: string;
}> = [];

export class ResultsPoller {
    constructor(
        private telegram: TelegramService,
        private jira: JiraService
    ) { }

    /**
     * Poll the results queue for completed/failed tasks.
     */
    async poll(): Promise<void> {
        if (!config.aws.resultQueueUrl) return;

        const command = new ReceiveMessageCommand({
            QueueUrl: config.aws.resultQueueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 1,
            VisibilityTimeout: 30,
        });

        const response = await sqsClient.send(command);
        if (!response.Messages?.length) return;

        for (const message of response.Messages) {
            try {
                const result = JSON.parse(message.Body || '{}') as TaskResult;
                console.log(`[Results] Got result: ${result.taskId} — ${result.status || result.title}`);

                await this.handleResult(result);

                // Delete the processed message
                await sqsClient.send(new DeleteMessageCommand({
                    QueueUrl: config.aws.resultQueueUrl,
                    ReceiptHandle: message.ReceiptHandle!,
                }));
            } catch (error) {
                console.error('[Results] Failed to process message:', error);
            }
        }
    }

    private async handleResult(result: TaskResult): Promise<void> {
        const filesChanged = result.codeArtifacts?.length || 0;
        const cost = result.totalCostUsd || 0;

        // Track for /status command
        recentTasks.unshift({
            taskId: result.taskId,
            title: result.title,
            status: result.status || 'completed',
            cost,
            completedAt: result.completedAt,
        });
        if (recentTasks.length > 20) recentTasks.pop();

        // Notify Telegram
        const isComplete = result.status === 'completed' || result.completedAt;
        const emoji = isComplete ? '✅' : '❌';

        await this.telegram.broadcast([
            `${emoji} *Task ${isComplete ? 'Completed' : 'Failed'}*`,
            ``,
            `📋 ${result.title}`,
            `🆔 \`${result.taskId}\``,
            result.jiraKey ? `🔑 Jira: ${result.jiraKey}` : '',
            `📁 Files: ${filesChanged}`,
            `💰 Cost: $${cost.toFixed(4)}`,
        ].filter(Boolean).join('\n'));

        // Update Jira ticket
        if (result.jiraKey) {
            if (isComplete) {
                await this.jira.addComment(
                    result.jiraKey,
                    `✅ Task completed by dev agent team.\n\n` +
                    `Files changed: ${filesChanged}\n` +
                    `Cost: $${cost.toFixed(4)}\n` +
                    `Completed: ${result.completedAt}`
                );
                await this.jira.transitionIssue(result.jiraKey, 'Done');
            } else {
                await this.jira.addComment(
                    result.jiraKey,
                    `❌ Task failed.\n\nThe dev agent team was unable to complete this task. Manual intervention may be needed.`
                );
            }
        }
    }

    /**
     * Get recent tasks for the /status command.
     */
    async getRecentTasks(): Promise<typeof recentTasks> {
        return recentTasks;
    }
}
