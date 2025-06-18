import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModel } from '../products/products.model';
import { CategoriesModel } from './categories.model';
import { FileModule } from 'src/file/file.module';
import {BotService} from "../bot/bot.service";
import {TokenService} from "../token/token.service";
import {JwtService} from "@nestjs/jwt";
import {JwtStrategy} from "../strategy/strategy";
import * as TelegramBot from "node-telegram-bot-api";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService,BotService,TokenService, JwtService,JwtStrategy,TelegramBot],
  imports: [
    SequelizeModule.forFeature([ProductsModel, CategoriesModel]),
    FileModule,
  ]
})
export class CategoriesModule {}
