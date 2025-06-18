import {Injectable} from '@nestjs/common';
import {tgBot} from "./bot";
import {CreateOrderDto} from "../orders/dto/create-order.dto";

@Injectable()
export class BotService{

    async errorMessage(text: string) {
        for (let chatId of process.env.BOT_CHAT_ID_MESSAGE_ERROR.split(",")) {
            await tgBot.sendMessage(chatId, `${text}`)
        }
    }

    async notification(adminId,order:any) {
        let str ='В заказе: \n'
        for (let i = 0; i < order.orderProducts.length; i++) {
            str += `${order.orderProducts[i].title} ${order.orderProducts[i].OrderProductsModel.count}\n`
        }
        for (let chatId of adminId) {
            await tgBot.sendMessage(
                chatId,
                `Появился новый заказ №${order.id}\nАдрес: ${order.address}\nИмя: ${order.name}\nТелефон: ${order.phone}\nТип доставки: ${order.typeDelivery}\nМетод оплаты: ${order.paymentMethod}\nКоментарий: ${order.comment}\n${str}`,
                {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Посмотреть заказ', web_app: {url: `${process.env.WEB_APP_URL}/order/${order.id}`}}]
                    ]
                }
            })
        }
    }

    async userNotification(chatId: any, message: string) {
        await tgBot.sendMessage(chatId, `${message}`)
    }

    async updateUser(chatId: string) {
        for (let admin of process.env.BOT_CHAT_ID_MESSAGE.split(",")) {
            await tgBot.sendMessage(admin, `Изменена роль пользователя ${chatId}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Посмотреть пользователя', web_app: {url: `${process.env.WEB_APP_URL}/update-user/${chatId}`}}]
                    ]
                }
            })
        }
    }

}

