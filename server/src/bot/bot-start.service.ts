import {Injectable} from '@nestjs/common';
import pLimit from 'p-limit';
import * as TelegramBot from 'node-telegram-bot-api'
import {TextMessageService} from "../text-message/text-message.service";
import {ContactsService} from "../contacts/contacts.service";
import {UsersService} from "../users/users.service";
import {tgBot} from "./bot";
import * as process from "process";
import {AuthService} from "../auth/auth.service";
import { OrdersService } from "../orders/orders.service";



const inlineKeyboardBtn = {
    contacts: 'Контакты',
    welcomeMessage: 'Приветственное сообщение',
}
const keyboardBtn = {
    contacts: 'Контакты',
    admin: 'Меню администратора',
}

@Injectable()
export class BotStartService {

    bot: TelegramBot
    dataBtn: string
    chatId: number
    newMessage: string
    welcomeText: string
    contacts: { address: string, phone: string, worktime: string }
    contactsMessage: string
    mailingText: string

    constructor(private textService: TextMessageService,
                private contactsService: ContactsService,
                private authService: AuthService,
                private usersService: UsersService,
                private ordersService: OrdersService,) {
        this.bot = tgBot
        this.start()
    }

    async callbackQuery(message: string, textBtn: string, callbackData?: string, dataBtn?: string) {
        this.dataBtn = dataBtn ? dataBtn : ''
        await this.bot.sendMessage(this.chatId, message, {
            reply_markup: {
                inline_keyboard: [
                    [{text: textBtn, callback_data: callbackData}]
                ]
            }
        })
    }

    async mailing(message: string) {
        this.mailingText = message
        await this.bot.sendMessage(this.chatId, `Текст рассылки\n${message}`, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Разослать', callback_data: 'sendMailing'}, {
                        text: 'Редактировать',
                        callback_data: 'editMailing'
                    }]
                ]
            }
        })
    }

    async sendMailing() {
        let interval: any;
        const usersChatId = await this.usersService.getChatId()
        // для теста const usersChatId = ['000000', '1035451470', '6485540551']
        const promises = usersChatId.map(chatId => this.bot.sendMessage(chatId, this.mailingText));
        let successList = 0
        let failureList = 0
        let blockedList = 0
        let countMessage = 2
        let startChaId = 0
        let endChaId = countMessage

        interval = setInterval(() => {
            Promise.allSettled(promises.slice(startChaId, endChaId))
                .then((results) => {
                    try {
                        const reject = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
                        startChaId += countMessage
                        endChaId += countMessage
                        successList += results?.filter(result => result.status === "fulfilled").length;
                        failureList += reject?.length
                        blockedList += reject?.filter(error => error.reason.response.statusCode === 403).length
                    } catch (e) {
                        console.log('error', e)
                    }
                    if (usersChatId.length + countMessage < endChaId) {
                        clearInterval(interval);
                        return this.bot.sendMessage(
                            this.chatId,
                            `Всего пользователей:${usersChatId.length}\nОтправлено сообщений:\nУдачно: [${successList}]\nНе удачно: [${failureList}]\nЗаблокированых: [${blockedList}]`
                        );
                    }
                })
        }, 1000)
    }

    start() {

        this.bot.on('message', async (msg) => {
            console.log(msg)
            const adminChatId = await this.usersService.findAdmin()
            const user = await this.usersService.findOne(`${msg.chat.id}`)
            if (!user) {
                await this.authService.authentication({
                    chatId: `${msg.chat.id}`,
                    queryId: 'ssss',
                    firstname: msg.from.first_name ?? '',
                    lastname: msg.from.last_name ?? '',
                    username: msg.from.username ?? ''
                })

                const newUser = await this.usersService.findOne(`${msg.chat.id}`)
                for (let adminId of adminChatId) {
                    await this.bot.sendMessage(
                        adminId,
                        `Создан новый пользователь!\nID: ${newUser.id} | @${newUser.username}\nfirstName: ${newUser.firstname}\nlastName: ${newUser.lastname}\nChat ID: ${newUser.chatId}\nSource: ${msg.text.split(' ')[1]}`,
                        {
                            reply_markup: {
                                inline_keyboard: [
                                    [{
                                        text: 'Посмотреть пользователя',
                                        web_app: {url: `${process.env.WEB_APP_URL}update-user/${newUser.chatId}`}
                                    }]
                                ]
                            }
                        }
                    )
                }
            }

            this.chatId = msg?.chat?.id
            const text = msg?.text
            this.newMessage = text
            const welcomeText = await this.textService.findOne('welcomeMessage')
            this.welcomeText = welcomeText?.text

            const mailingText = await this.textService.findOne('mailingText')
            this.mailingText = mailingText?.text
            this.contacts = await this.contactsService.findOne(1)
            if (text === '/start') {
                const arrButtons = [
                    (user?.role === 'superAdmin' || user?.role === 'admin') ?
                        [{text: keyboardBtn.contacts}, {text: keyboardBtn.admin}]
                        :
                        [{text: keyboardBtn.contacts}]
                ]

                this.contactsMessage = `Адрес заведения: ${this.contacts?.address}\nНомер телефона заведения: ${this.contacts?.phone}\nЧасы работы: ${this.contacts?.worktime}`
                const textStart = `Добро пожаловать ${msg?.from?.username ?? msg?.from?.first_name}`
                await this.bot.sendMessage(
                    this.chatId,
                    textStart,
                    {
                        disable_notification: true,
                        reply_markup: {
                            resize_keyboard: true,
                            keyboard: arrButtons,
                        },
                    })
                await this.bot.sendMessage(
                    this.chatId,
                    this.welcomeText,
                    {
                        disable_notification: true,
                        reply_markup: {
                            inline_keyboard: [[{text: 'Заказать еду', web_app: {url: `${process.env.WEB_APP_URL}`}}]],
                        },
                        parse_mode: "HTML"
                    })

                return

            }
            if (msg.text === keyboardBtn.admin) {
                await this.bot.sendMessage(this.chatId, keyboardBtn.admin, {
                    disable_notification: true,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {text: inlineKeyboardBtn.contacts, callback_data: 'contacts',},
                                {text: inlineKeyboardBtn.welcomeMessage, callback_data: 'welcomeMessage',}
                            ],
                            [{text: 'Рассылка', callback_data: 'mailing'}]

                        ],
                    },
                })
            }
            if (msg.text === keyboardBtn.contacts) {
                await this.bot.sendMessage(this.chatId, `Наши контакты\n${this.contactsMessage}`, {parse_mode: "HTML"})
                return
            }
            if (this.dataBtn === 'editContacts' && this.newMessage) {
                await this.callbackQuery(this.newMessage, 'Сохранить контакты', 'saveContacts')
                return
            }
            if (this.dataBtn === 'editWelcomeMessage' && this.newMessage) {
                await this.callbackQuery(this.newMessage, 'Сохранить сообщение', 'saveWelcomeMessage')
                return
            }
            if (this.dataBtn === 'newMailing' && this.newMessage) {
                const text = `Текст рассылки\n${this.newMessage}`
                await this.callbackQuery(text, 'Сохранить', 'saveMailing')
                return
            }



        })

        this.bot.on('callback_query', async msg => {
            // Сброс данных
            if (msg.data === 'reset') {
                this.dataBtn = ''
                this.newMessage = ''
            }

            // Кнопка редактирования контактов
            if (msg.data === 'contacts') {
                const text = `Контакты\n\nАдрес заведения: ${this.contacts?.address}\nНомер телефона заведения: ${this.contacts?.phone}\nЧасы работы: ${this.contacts?.worktime}\n\nДля редактирования введите контакты через запятую, без пробелов.\n\nНапирмер: ул. Ленина д1,с 10.00 до 22.00,+7(911)-111-11-11`
                await this.callbackQuery(text, 'Отменить', 'reset', 'editContacts')
                return
            }
            if (msg.data === 'saveContacts') {
                const arr = this.newMessage.split(',')
                const data = {address: arr[0], worktime: arr[1], phone: arr[2]}
                if (this.contacts) {
                    await this.contactsService.update(1, data)
                        .then(() => this.bot.sendMessage(this.chatId, `Сохранено`,))
                } else {
                    await this.contactsService.create(data)
                        .then(() => this.bot.sendMessage(this.chatId, `Сохранено`,))
                }
            }

            // Кнопка редактирования приветственного сообщения
            if (msg.data === 'welcomeMessage') {
                const text = `Приветственное сообщение:\n\n${this.welcomeText}\n\nДля редактирования введите текст`
                await this.callbackQuery(text, 'Отменить', 'reset', 'editWelcomeMessage')
                return
            }
            if (msg.data === 'saveWelcomeMessage') {
                if (this.welcomeText) {
                    await this.textService.update({text: this.newMessage, type: 'welcomeMessage'})
                        .then(() => this.bot.sendMessage(this.chatId, `Сохранено`,))
                    return
                } else {
                    await this.textService.create({text: this.newMessage, type: 'welcomeMessage'})
                        .then(() => this.bot.sendMessage(this.chatId, `Сохранено`,))
                    return
                }
            }

            // Кнопка редактирования рассылки
            if (msg.data === 'mailing') {
                await this.mailing(this.mailingText)
                return
            }
            if (msg.data === 'editMailing') {
                this.dataBtn = 'newMailing'
                await this.bot.sendMessage(this.chatId, 'Введите сообщение')
                return
            }
            if (msg.data === 'saveMailing' && this.newMessage) {
                if (this.mailingText) {
                    await this.textService.update({text: this.newMessage, type: 'mailingText'})
                        .then(() => this.mailing(this.newMessage))
                    return
                } else {
                    await this.textService.create({text: this.newMessage, type: 'mailingText'})
                        .then(() => this.mailing(this.newMessage))
                    return
                }
            }
            if (msg.data === 'sendMailing') {
                this.sendMailing()
            }
            //изменения статуса заказа
            if (msg.data?.startsWith('setStatus_')) {
                const [, status, orderIdStr] = msg.data.split('_');
                const orderId = parseInt(orderIdStr);

                const adminChatIds = await this.usersService.findAdmin();
                if (!adminChatIds.includes(String(msg.from.id))) {
                    await this.bot.answerCallbackQuery(msg.id); // ✅ ответить, чтобы остановить мигание
                    await this.bot.sendMessage(msg.from.id, '❌ У вас нет прав для изменения статуса.');
                    return;
                }

                await this.ordersService.updateOrder(orderId, {
                    status,
                    notifications: true,
                });

                await this.bot.answerCallbackQuery(msg.id); // ✅ обязательно
                await this.bot.sendMessage(msg.from.id, `✅ Статус заказа №${orderId} обновлён на "${status}"`);
                return;
            }
        })
    }

}


