// ============================================================
// Jira Service — Polls, reads, and comments on Jira issues
// ============================================================

import { config } from './config';
import type { SQSBridge } from './sqs-bridge';

interface JiraIssue {
    key: string;
    id: string;
    fields: {
        summary: string;
        description: string | null;
        status: { name: string };
        priority?: { name: string };
        labels: string[];
        assignee?: { displayName: string };
        issuetype?: { name: string };
    };
}

interface JiraSearchResult {
    issues: JiraIssue[];
    total: number;
}

// Track which issues we've already dispatched (in-memory; resets on restart)
const dispatchedIssues = new Set<string>();

export class JiraService {
    private baseUrl: string;
    private auth: string;

    constructor() {
        this.baseUrl = config.jira.baseUrl;
        this.auth = Buffer.from(`${config.jira.email}:${config.jira.apiToken}`).toString('base64');
    }

    private async request<T>(path: string, options: { method?: string; body?: any } = {}): Promise<T> {
        const url = `${this.baseUrl}/rest/api/3${path}`;
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers: {
                'Authorization': `Basic ${this.auth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Jira API ${response.status}: ${text}`);
        }

        return response.json() as T;
    }

    async getIssue(key: string): Promise<JiraIssue | null> {
        try {
            return await this.request<JiraIssue>(`/issue/${key}`);
        } catch (error) {
            console.error(`[Jira] Failed to get issue ${key}:`, error);
            return null;
        }
    }

    async addComment(issueKey: string, body: string): Promise<void> {
        if (!this.baseUrl) return;

        try {
            await this.request(`/issue/${issueKey}/comment`, {
                method: 'POST',
                body: {
                    body: {
                        type: 'doc',
                        version: 1,
                        content: [{
                            type: 'paragraph',
                            content: [{ type: 'text', text: body }],
                        }],
                    },
                },
            });
            console.log(`[Jira] Added comment to ${issueKey}`);
        } catch (error) {
            console.error(`[Jira] Failed to comment on ${issueKey}:`, error);
        }
    }

    async transitionIssue(issueKey: string, transitionName: string): Promise<void> {
        if (!this.baseUrl) return;

        try {
            // Get available transitions
            const { transitions } = await this.request<{ transitions: Array<{ id: string; name: string }> }>(
                `/issue/${issueKey}/transitions`
            );

            const transition = transitions.find(
                (t) => t.name.toLowerCase() === transitionName.toLowerCase()
            );

            if (transition) {
                await this.request(`/issue/${issueKey}/transitions`, {
                    method: 'POST',
                    body: { transition: { id: transition.id } },
                });
                console.log(`[Jira] Transitioned ${issueKey} → ${transitionName}`);
            } else {
                console.warn(`[Jira] Transition "${transitionName}" not found for ${issueKey}`);
            }
        } catch (error) {
            console.error(`[Jira] Failed to transition ${issueKey}:`, error);
        }
    }

    /**
     * Poll Jira for issues with the configured label in "To Do" status.
     * Returns the number of tasks dispatched.
     */
    async pollAndDispatch(sqsBridge: SQSBridge): Promise<number> {
        if (!this.baseUrl) {
            console.log('[Jira] Not configured — skipping poll');
            return 0;
        }

        const jql = `project = ${config.jira.projectKey} AND labels = "${config.jira.pollLabel}" AND status = "To Do" ORDER BY created DESC`;

        try {
            const result = await this.request<JiraSearchResult>(
                `/search?jql=${encodeURIComponent(jql)}&maxResults=10&fields=summary,description,status,priority,labels,assignee,issuetype`
            );

            let dispatched = 0;

            for (const issue of result.issues) {
                if (dispatchedIssues.has(issue.key)) continue;

                console.log(`[Jira] Dispatching: ${issue.key} — ${issue.fields.summary}`);

                await sqsBridge.submitJiraTask(issue);
                dispatchedIssues.add(issue.key);

                // Comment on the Jira ticket
                await this.addComment(
                    issue.key,
                    `🤖 OpenClaw Bot — Task dispatched to dev agent team.\n\nTask ID: jira-${issue.key.toLowerCase()}-${Date.now()}`
                );

                // Transition to "In Progress"
                await this.transitionIssue(issue.key, 'In Progress');

                dispatched++;
            }

            if (dispatched > 0) {
                console.log(`[Jira] Dispatched ${dispatched} new task(s)`);
            }

            return dispatched;
        } catch (error) {
            console.error('[Jira] Poll failed:', error);
            return 0;
        }
    }
}
