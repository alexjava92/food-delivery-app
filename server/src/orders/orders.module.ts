import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersModel } from './orders.model';
import { ProductsModel } from 'src/products/products.model';
import { OrderProductsModel } from './ordersProducts.model';
import {BotService} from "../bot/bot.service";
import * as TelegramBot from "node-telegram-bot-api";
import {UsersService} from "../users/users.service";
import {UsersModel} from "../users/users.model";
import {CategoriesModel} from "../categories/categories.model";
import {WebsocketService} from "../websocket/websocket.gateway";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService,BotService,TelegramBot,UsersService,WebsocketService],
  imports: [
    SequelizeModule.forFeature([OrderProductsModel,CategoriesModel,OrdersModel, ProductsModel,UsersModel]),
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
