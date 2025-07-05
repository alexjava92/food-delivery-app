import {Module} from '@nestjs/common';
import {BotService} from './bot.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TextMessageModel} from "../text-message/text-message.model";
import {BotStartService} from "./bot-start.service";
import {TextMessageService} from "../text-message/text-message.service";
import {ContactsService} from "../contacts/contacts.service";
import {ContactsModel} from "../contacts/contacts.model";
import {UsersService} from "../users/users.service";
import {UsersModel} from "../users/users.model";
import {AuthService} from "../auth/auth.service";
import {TokenService} from "../token/token.service";
import {JwtService} from "@nestjs/jwt";
import {OrdersModule} from "../orders/orders.module";
import {OrderMessageModel} from "../orders/order-message.model";
import {MessageSyncService} from "./message-sync/message-sync.service";

@Module({
    providers: [BotService, BotStartService, TextMessageService, ContactsService, UsersService, AuthService, TokenService, JwtService, MessageSyncService],
    imports: [
        SequelizeModule.forFeature([TextMessageModel, ContactsModel, UsersModel, OrderMessageModel ]),
        OrdersModule
    ],
    exports: [BotService, SequelizeModule, MessageSyncService]
})
export class BotModule {
}
