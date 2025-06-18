import { Module } from '@nestjs/common';
import { TextMessageService } from './text-message.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {TextMessageModel} from "./text-message.model";

@Module({
  providers: [TextMessageService],
  imports: [SequelizeModule.forFeature([TextMessageModel]) ],
  exports:[TextMessageService]
})
export class TextMessageModule {}
