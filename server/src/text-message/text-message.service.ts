import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {TextMessageModel} from "./text-message.model";
import {CreateTextDto} from "./text-message.dto";

@Injectable()
export class TextMessageService {
    constructor(
        @InjectModel(TextMessageModel)
        private textRepository: typeof TextMessageModel
    ) {
    }

    async create(dto:CreateTextDto) {
        return await this.textRepository.create({...dto})
    }


    async findOne(type:string) {
        return await this.textRepository.findOne({ where: { type } });
    }

    async update(dto:CreateTextDto) {
        const product = await this.textRepository.findOne({ where: { type:dto.type } });

        return await product.update({text:dto.text});
    }
}
