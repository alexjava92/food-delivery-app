import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {ContactsModel} from "./contacts.model";
import {ContactDto} from "./contacts.dto";

@Injectable()
export class ContactsService {
    constructor(
        @InjectModel(ContactsModel)
        private contactsRepository: typeof ContactsModel
    ) {
    }

    async create(dto:ContactDto) {
        return await this.contactsRepository.create({...dto})
    }


    async findOne(id:number) {
        return await this.contactsRepository.findOne({ where: { id } });
    }

    async update(id:number,dto:ContactDto) {
        const contacts = await this.contactsRepository.findOne({ where: { id } });

        return await contacts.update({...dto});
    }
}
