import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModel } from '../categories/categories.model';
import { ProductsService } from './products.service';
import { ProductsModel } from './products.model';
import { FileModule } from '../file/file.module';
import { ProductsController } from './products.controller';
import { OrderProductsModel } from 'src/orders/ordersProducts.model';
import {BotService} from "../bot/bot.service";
import * as TelegramBot from "node-telegram-bot-api";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService,BotService,TelegramBot],
  imports: [
    SequelizeModule.forFeature([ProductsModel, CategoriesModel,OrderProductsModel]),
    FileModule,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
