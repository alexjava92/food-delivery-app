import { Module } from '@nestjs/common';
import { MessageSyncService } from './message-sync.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {OrderMessageModel} from "../../orders/order-message.model";
import {BotService} from "../bot.service";


@Module({
    imports: [SequelizeModule.forFeature([OrderMessageModel])],
    providers: [MessageSyncService, BotService], // или только MessageSyncService если BotService не нужен
    exports: [MessageSyncService],
})
export class MessageModule {}
