import * as TelegramBot from "node-telegram-bot-api";
import * as dotenv from 'dotenv'
dotenv.config();
const token = process.env.BOT_TOKEN;
export const tgBot = new TelegramBot(token, {polling: true})