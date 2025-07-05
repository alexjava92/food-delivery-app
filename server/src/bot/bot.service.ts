import { Injectable } from '@nestjs/common';
import { tgBot } from "./bot";
import TelegramBot from "node-telegram-bot-api";

@Injectable()
export class BotService {
    async errorMessage(text: string) {
        for (const chatId of process.env.BOT_CHAT_ID_MESSAGE_ERROR.split(",")) {
            await tgBot.sendMessage(chatId, text);
        }
    }

    public formatOrderNotification(order: any): string {
        const isPickup = order.typeDelivery === 'Самовывоз';
        const emoji = isPickup ? '🏠' : '🚚';

        const statusEmojiMap = {
            "отменен": "🔴",
            "готово к выдаче": "🟠",
            "выдано": "🟢",
            "готовится": "🔵",
            "новый": "🟡"
        };

        const statusLine = `${statusEmojiMap[order.status] || ''} ${order.status}`;

        const productsList = order.orderProducts.map(p =>
            `• ${p.title} [${p.OrderProductsModel?.count || p.order_product?.count || 1} шт.]`
        ).join('\n');

        let message = `${statusLine}\n\nПоявился новый заказ ${emoji} №${order.id}\n\n`;

        if (!isPickup) message += `Адрес: ${order.address}\n`;
        message += `Имя: ${order.name}\n`;
        message += `Телефон: ${order.phone}\n`;
        message += `Тип доставки: ${order.typeDelivery}\n`;
        if (!isPickup) message += `Метод оплаты: ${order.paymentMethod}\n`;
        message += `Комментарий: ${order.comment?.trim() || '-'}\n\n`;
        message += `В заказе:\n${productsList}`;

        return message;
    }


    async notification(adminIds: string[], order: any) {
        if (!Array.isArray(adminIds) || adminIds.length === 0) return [];

        const status = order.status;
        const isPickup = order.typeDelivery === 'Самовывоз';

        const nextStatusButtons = [];

        if (status === 'новый' || status === 'отменен') {
            nextStatusButtons.push({ text: "Готовится", callback_data: `setStatus_готовится_${order.id}` });
        }
        if (status === 'готовится') {
            if (isPickup) {
                nextStatusButtons.push({ text: "Готово к выдаче", callback_data: `setStatus_готово к выдаче_${order.id}` });
            } else {
                nextStatusButtons.push({ text: "Выдан", callback_data: `setStatus_выдано_${order.id}` });
            }
        }
        if (status === 'готово к выдаче') {
            nextStatusButtons.push({ text: "Выдан", callback_data: `setStatus_выдано_${order.id}` });
        }

        nextStatusButtons.push({ text: "Отменен", callback_data: `setStatus_отменен_${order.id}` });

        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Посмотреть заказ", web_app: { url: `${process.env.WEB_APP_URL}order/${order.id}` } }],
                    nextStatusButtons
                ],
            },
        };

        const message = this.formatOrderNotification(order);
        const responses = [];

        for (const chatId of adminIds) {
            try {
                const sent = await tgBot.sendMessage(chatId, message, keyboard);
                responses.push({
                    chatId,
                    messageId: sent.message_id,
                });
            } catch (e) {
                console.error(`[BotService] Ошибка отправки сообщения chatId=${chatId}:`, e.message);
            }
        }

        return responses;
    }


    async userNotification(chatId: string | number, message: string) {
        try {
            await tgBot.sendMessage(chatId, message);
        } catch (e) {
            console.error(`[BotService] Ошибка отправки пользователю chatId=${chatId}:`, e.message);
        }
    }

    async updateUser(chatId: string) {
        for (const admin of process.env.BOT_CHAT_ID_MESSAGE.split(",")) {
            try {
                await tgBot.sendMessage(admin, `Изменена роль пользователя ${chatId}`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Посмотреть пользователя', web_app: { url: `${process.env.WEB_APP_URL}update-user/${chatId}` } }]
                        ]
                    }
                });
            } catch (e) {
                console.error(`[BotService] Ошибка уведомления об обновлении роли chatId=${admin}:`, e.message);
            }
        }
    }




}