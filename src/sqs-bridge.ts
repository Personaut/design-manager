// ============================================================
// SQS Bridge — Sends tasks to the Dev Agent pipeline
// ============================================================

import {
    SQSClient,
    SendMessageCommand,
} from '@aws-sdk/client-sqs';
import { config } from './config';

const sqsClient = new SQSClient({ region: config.aws.region });

interface TelegramTaskInput {
    taskId: string;
    title: string;
    description: string;
    chatId: number;
}

interface JiraIssue {
    key: string;
    fields: {
        summary: string;
        description: string | null;
        priority?: { name: string };
    };
}

export class SQSBridge {
    /**
     * Submit a task from Telegram to the dev agent queue.
     */
    async submitTelegramTask(input: TelegramTaskInput): Promise<string> {
        const message = {
            messageType: 'telegram_task',
            taskId: input.taskId,
            title: input.title,
            description: input.description,
            priority: 'medium',
            source: 'telegram',
            createdAt: new Date().toISOString(),
            metadata: {
                repositoryUrl: config.github.defaultRepo,
                telegramChatId: String(input.chatId),
            },
        };

        return this.send(message);
    }

    /**
     * Submit a task from Jira to the dev agent queue.
     */
    async submitJiraTask(issue: JiraIssue): Promise<string> {
        const priority = (issue.fields.priority?.name || 'medium').toLowerCase();
        const normalizedPriority = ['highest', 'high'].includes(priority) ? 'high'
            : ['low', 'lowest'].includes(priority) ? 'low'
                : 'medium';

        // Extract plain text from Jira's ADF description
        const description = typeof issue.fields.description === 'string'
            ? issue.fields.description
            : this.extractTextFromADF(issue.fields.description);

        const message = {
            messageType: 'jira_task',
            taskId: `jira-${issue.key.toLowerCase()}-${Date.now()}`,
            jiraKey: issue.key,
            title: issue.fields.summary,
            description: description || issue.fields.summary,
            priority: normalizedPriority,
            source: 'jira',
            createdAt: new Date().toISOString(),
            metadata: {
                repositoryUrl: config.github.defaultRepo,
            },
        };

        return this.send(message);
    }

    private async send(message: Record<string, any>): Promise<string> {
        if (!config.aws.taskQueueUrl) {
            console.warn('[SQS] No task queue URL configured — message not sent');
            console.log('[SQS] Would have sent:', JSON.stringify(message, null, 2));
            return 'dry-run';
        }

        const command = new SendMessageCommand({
            QueueUrl: config.aws.taskQueueUrl,
            MessageBody: JSON.stringify(message),
            MessageAttributes: {
                messageType: {
                    DataType: 'String',
                    StringValue: message.messageType,
                },
            },
        });

        const result = await sqsClient.send(command);
        console.log(`[SQS] Sent task ${message.taskId} → ${config.aws.taskQueueUrl} (${result.MessageId})`);
        return result.MessageId || '';
    }

    /**
     * Extract plain text from Jira's Atlassian Document Format (ADF).
     */
    private extractTextFromADF(adf: any): string {
        if (!adf || typeof adf !== 'object') return '';

        const texts: string[] = [];

        const walk = (node: any) => {
            if (node.type === 'text' && node.text) {
                texts.push(node.text);
            }
            if (Array.isArray(node.content)) {
                for (const child of node.content) walk(child);
            }
        };

        walk(adf);
        return texts.join(' ').trim();
    }
}
