import { Injectable } from '@nestjs/common';
import { tgBot } from "./bot";

@Injectable()
export class BotService {
    async errorMessage(text: string) {
        for (const chatId of process.env.BOT_CHAT_ID_MESSAGE_ERROR.split(",")) {
            await tgBot.sendMessage(chatId, text);
        }
    }

    private formatOrderNotification(order: any): string {
        const isPickup = order.typeDelivery === 'Самовывоз';
        const emoji = isPickup ? '🏠' : '🚚';
        const productsList = order.orderProducts.map(p =>
            `• ${p.title} [${p.OrderProductsModel.count} шт.]`
        ).join('\n');

        let message = `Появился новый заказ ${emoji} №${order.id}\n\n`;
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
        if (!Array.isArray(adminIds) || adminIds.length === 0) return;

        const message = this.formatOrderNotification(order);
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Посмотреть заказ', web_app: { url: `${process.env.WEB_APP_URL}order/${order.id}` } }]
                ]
            }
        };

        for (const chatId of adminIds) {
            try {
                await tgBot.sendMessage(chatId, message, keyboard);
            } catch (e) {
                console.error(`[BotService] Ошибка отправки сообщения chatId=${chatId}:`, e.message);
            }
        }
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