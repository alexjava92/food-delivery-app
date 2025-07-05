import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderMessageModel } from '../../orders/order-message.model';
import { tgBot } from '../bot';
import {BotService} from "../bot.service";


@Injectable()
export class MessageSyncService {
    constructor(
        @InjectModel(OrderMessageModel)
        private readonly orderMessageModel: typeof OrderMessageModel,
        private readonly botService: BotService
    ) {}


    async updateAllAdminMessages(order: any) {
        const updatedText = this.botService.formatOrderNotification(order);

        const updatedKeyboard = {
            inline_keyboard: [
                [{ text: "Посмотреть заказ", web_app: { url: `${process.env.WEB_APP_URL}order/${order.id}` } }],
                this.botService.generateStatusButtons(order)
            ]
        };

        const messages = await this.orderMessageModel.findAll({
            where: { orderId: order.id }
        });

        for (const msg of messages) {
            try {
                await tgBot.editMessageText(updatedText, {
                    chat_id: msg.chatId,
                    message_id: msg.messageId,
                    reply_markup: updatedKeyboard,
                    parse_mode: "HTML"
                });
            } catch (e) {
                const description = e.response?.body?.description;
                if (description?.includes('message is not modified')) {
                    console.log(`⚠️ Telegram: сообщение уже актуально — chatId=${msg.chatId}, orderId=${order.id}`);
                } else {
                    console.error(`❌ Ошибка обновления сообщения chatId=${msg.chatId}, orderId=${order.id}:`, e.message);
                }
            }
        }
    }

}
