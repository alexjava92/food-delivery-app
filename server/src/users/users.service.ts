import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersModel} from './users.model';
import {InjectModel} from '@nestjs/sequelize';
import {UsersDto} from './users.dto';
import {BotService} from "../bot/bot.service";
import {Op} from "sequelize";
import {ProductsModel} from "../products/products.model";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel) private usersRepository: typeof UsersModel,
        private botService: BotService) {
    }
    async getAll() {
        try {
            return await this.usersRepository.findAll();
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении всех пользователей: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении всех пользователей: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async getChatId() {
        try {
            const users = await this.usersRepository.findAll();
            return users.map(user => user.chatId);
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении всех пользователей: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении всех пользователей: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(chatId: string ) {
        return this.usersRepository.findOne({where: {chatId}});
    }
    async findOneId(id: number ) {
        return this.usersRepository.findOne({where: {id}});
    }

    async findAdmin() {
        const admins = await this.usersRepository.findAll({
            where: {
                [Op.or]: [
                    {role: 'admin'},
                    {role: 'superAdmin'}
                ]
            }
        });
        return admins.map(admin => admin.chatId);
    }

    async createUser(dto: UsersDto) {
        try {
            return await UsersModel.create({...dto})
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при создании пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при создании пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateUser(id: number, dto: Partial<UsersDto>) {
        try {
            const user = await this.usersRepository.findByPk(id);
            await user.update(dto);
            return user;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при обновлении пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при обновлении пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateRoleUser(chatId: string,body) {
        try {
            const user = await this.usersRepository.findOne({where: {chatId}});
            await user.update({role: body.role});
            await this.botService.updateUser(chatId)
            return user;
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при обновлении роли пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при обновлении роли пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async search(query: string) {
        console.log('query',query)
        try {
            return await this.usersRepository.findAll({ where: {name: {[Op.iLike]: `%${query}%`}} });
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при поиске пользователя: ${e}`)
            throw new HttpException(
                `Произошла ошибка при обновлении роли пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
