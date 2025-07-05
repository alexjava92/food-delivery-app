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

        const currentStatus = order.status;
        const isPickup = order.typeDelivery === 'Самовывоз';

        const nextStatusButtons = [];

        if (currentStatus === 'новый' || currentStatus === 'отменен') {
            nextStatusButtons.push({ text: "Готовится", callback_data: `setStatus_готовится_${order.id}` });
        }

        if (currentStatus === 'готовится') {
            if (isPickup) {
                nextStatusButtons.push({ text: "Готово к выдаче", callback_data: `setStatus_готово к выдаче_${order.id}` });
            } else {
                nextStatusButtons.push({ text: "Выдан", callback_data: `setStatus_выдано_${order.id}` });
            }
        }

        if (currentStatus === 'готово к выдаче') {
            nextStatusButtons.push({ text: "Выдан", callback_data: `setStatus_выдано_${order.id}` });
        }

        nextStatusButtons.push({ text: "Отменен", callback_data: `setStatus_отменен_${order.id}` });

        const updatedKeyboard = {
            inline_keyboard: [
                [{ text: "Посмотреть заказ", web_app: { url: `${process.env.WEB_APP_URL}order/${order.id}` } }],
                nextStatusButtons
            ]
        };

        const messages = await this.orderMessageModel.findAll({ where: { orderId: order.id } });

        for (const msg of messages) {
            try {
                await tgBot.editMessageText(updatedText, {
                    chat_id: msg.chatId,
                    message_id: msg.messageId,
                    reply_markup: updatedKeyboard,
                    parse_mode: "HTML"
                });
            } catch (e) {
                if (e.response?.body?.description?.includes('message is not modified')) {
                    console.log(`ℹ️ Сообщение уже актуально: orderId=${order.id}, chatId=${msg.chatId}`);
                    continue;
                }
                console.error(`❌ Ошибка обновления сообщения: orderId=${order.id}, chatId=${msg.chatId}:`, e.message);
            }
        }

    }
}
