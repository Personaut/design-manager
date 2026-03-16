// ============================================================
// Telegram Service — Bot interface for commands & notifications
// ============================================================

import TelegramBot from 'node-telegram-bot-api';
import { config } from './config';

type CommandHandler = (msg: TelegramBot.Message, args?: string) => Promise<void>;

export class TelegramService {
    private bot: TelegramBot | null = null;
    private commands = new Map<string, CommandHandler>();

    start(): void {
        if (!config.telegram.botToken) {
            console.warn('[Telegram] No bot token configured — Telegram disabled');
            return;
        }

        this.bot = new TelegramBot(config.telegram.botToken, { polling: true });

        this.bot.on('message', async (msg) => {
            if (!msg.text) return;

            // Check allowed chat IDs (empty = allow all)
            if (config.telegram.allowedChatIds.length > 0 &&
                !config.telegram.allowedChatIds.includes(msg.chat.id)) {
                console.log(`[Telegram] Blocked message from unauthorized chat: ${msg.chat.id}`);
                return;
            }

            // Parse command
            const match = msg.text.match(/^\/(\w+)(?:\s+(.*))?$/s);
            if (match) {
                const [, command, args] = match;
                const handler = this.commands.get(`/${command}`);
                if (handler) {
                    try {
                        await handler(msg, args?.trim());
                    } catch (error) {
                        console.error(`[Telegram] Command /${command} failed:`, error);
                        await this.reply(msg, `❌ Command failed: ${error}`);
                    }
                } else {
                    await this.reply(msg, `❓ Unknown command: /${command}\nUse /help for available commands.`);
                }
            }
        });

        console.log('[Telegram] Bot started with polling');
    }

    onCommand(command: string, handler: CommandHandler): void {
        this.commands.set(command, handler);
    }

    async reply(msg: TelegramBot.Message, text: string): Promise<void> {
        if (!this.bot) return;
        await this.bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
    }

    async broadcast(text: string): Promise<void> {
        if (!this.bot) return;
        for (const chatId of config.telegram.allowedChatIds) {
            try {
                await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
            } catch (error) {
                console.error(`[Telegram] Broadcast to ${chatId} failed:`, error);
            }
        }
    }

    async sendTo(chatId: number, text: string): Promise<void> {
        if (!this.bot) return;
        await this.bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }

    handleWebhook(body: any): void {
        if (this.bot) {
            this.bot.processUpdate(body);
        }
    }
}
