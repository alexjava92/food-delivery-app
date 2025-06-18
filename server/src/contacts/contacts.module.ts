import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {ContactsModel} from "./contacts.model";
import {ContactsController} from "./contacts.controller";

@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  imports: [SequelizeModule.forFeature([ContactsModel]) ],
  exports:[ContactsService]
})
export class ContactsModule {}
