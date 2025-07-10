import { Injectable } from '@nestjs/common';
import { tgBot } from "./bot";
import TelegramBot from "node-telegram-bot-api";
import {format, formatDistanceToNow} from "date-fns";

@Injectable()
export class BotService {
    async errorMessage(text: string) {
        for (const chatId of process.env.BOT_CHAT_ID_MESSAGE_ERROR.split(",")) {
            await tgBot.sendMessage(chatId, text);
        }
    }

    public generateStatusButtons(order: any) {
        const status = order.status;
        const isPickup = order.typeDelivery === 'Самовывоз';

        const nextStatusButtons = [];

        if (status === 'новый' || status === 'отменен') {
            nextStatusButtons.push({ text: "🔵 Готовится", callback_data: `setStatus_готовится_${order.id}` });
        }

        if (status === 'готовится') {
            if (isPickup) {
                nextStatusButtons.push({ text: "🟠 Готово к выдаче", callback_data: `setStatus_готово к выдаче_${order.id}` });
            } else {
                nextStatusButtons.push({ text: "🟢 Выдан", callback_data: `setStatus_выдано_${order.id}` });
            }
        }

        if (status === 'готово к выдаче') {
            nextStatusButtons.push({ text: "🟢 Выдан", callback_data: `setStatus_выдано_${order.id}` });
        }

        nextStatusButtons.push({
            text: "Отменить",
            callback_data: `confirmCancel_${order.id}`,
        })

        return nextStatusButtons;
    }

    public formatOrderNotification(order: any): string {
        const isPickup = order.typeDelivery === 'Самовывоз';
        const emoji = isPickup ? '📍🚶‍♂️' : '🚚';

        const statusEmojiMap = {
            "отменен": "🔴",
            "готово к выдаче": "🟠",
            "выдано": "🟢",
            "готовится": "🔵",
            "новый": "🟡"
        };

        const statusLine = `<b>СТАТУС: ${statusEmojiMap[order.status] || ''} ${order.status.toUpperCase()}</b>`;


        const productsList = order.orderProducts.map(p => {
            const count = p.OrderProductsModel?.count || p.order_product?.count || 1;
            return `• ${p.title} [${count} шт.]`;
        }).join('\n');

        const total = order.orderProducts.reduce((sum, p) => {
            const count = p.OrderProductsModel?.count || p.order_product?.count || 1;
            const price = Number(p.price) || 0;
            return sum + count * price;
        }, 0);

        const delivery = !isPickup ? Number(order.deliveryPrice || 0) : 0;
        const grandTotal = total + delivery;

        const formatTime = (date: string) =>
            new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        const createdAt = formatTime(order.createdAt);
        const updatedAt = formatTime(order.updatedAt);

        let message = `${statusLine}\n\nЗаказ #n${order.id}  ${emoji}\n\n`;

        if (!isPickup) message += `Адрес: ${order.address}\n`;
        message += `Имя: ${order.name}\n`;
        message += `Телефон: ${order.phone}\n`;
        message += `Тип доставки: ${order.typeDelivery}\n`;
        if (!isPickup) message += `Метод оплаты: ${order.paymentMethod}\n`;
        message += `Комментарий: ${order.comment?.trim() || '-'}\n\n`;

        message += `В заказе:\n${productsList}`;

        if (!isPickup) {
            message += `\n\nСумма заказа: ${total}₽\nДоставка: ${delivery}₽\nИтого к оплате: ${grandTotal}₽`;
        } else {
            message += `\n\nИтого к оплате: ${grandTotal}₽`;
        }

        // Добавляем блок статусов
        message += `\n\n⏱ Принят: ${createdAt}`;
        message += `\n📋 Статус: ${statusEmojiMap[order.status] || ''} ${order.status} (${updatedAt})`;

        return message;
    }




    async notification(adminIds: string[], order: any) {
        if (!Array.isArray(adminIds) || adminIds.length === 0) return [];


        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Посмотреть заказ", web_app: { url: `${process.env.WEB_APP_URL}order/${order.id}` } }],
                    this.generateStatusButtons(order)
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
                    parse_mode: "HTML",
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