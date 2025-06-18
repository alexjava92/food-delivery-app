import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersModel } from './users.model';
import { UsersController } from './users.controller';
import { OrdersModel } from 'src/orders/orders.model';
import {BotService} from "../bot/bot.service";
@Module({
  controllers: [UsersController],
  providers: [UsersService,BotService],
  imports: [SequelizeModule.forFeature([UsersModel,OrdersModel])],
  exports: [UsersService]
})
export class UsersModule {}
