import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModel } from 'src/products/products.model';
import {BotService} from "../bot/bot.service";
import * as TelegramBot from "node-telegram-bot-api";
import {CategoriesModel} from "../categories/categories.model";

@Module({
  controllers: [SearchController],
  providers: [SearchService,BotService,TelegramBot],
  imports: [
    SequelizeModule.forFeature([CategoriesModel,ProductsModel]),
  ],
})
export class SearchModule {}
