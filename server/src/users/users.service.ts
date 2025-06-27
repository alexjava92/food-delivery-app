import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UsersModel} from './users.model';
import {InjectModel} from '@nestjs/sequelize';
import {UsersDto} from './users.dto';
import {BotService} from "../bot/bot.service";
import {Op} from "sequelize";
import {ProductsModel} from "../products/products.model";
import {Inject} from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersModel) private usersRepository: typeof UsersModel,
        private botService: BotService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
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

    async findOne(chatId: string) {
        return this.usersRepository.findOne({where: {chatId}});
    }

    async findOneId(id: number) {
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

    async updateRoleUser(chatId: string, body) {
        try {
            const user = await this.usersRepository.findOne({ where: { chatId } });
            if (!user) throw new Error('User not found');

            await user.update({ role: body.role });
            const refreshed = await this.usersRepository.findOne({ where: { chatId } });

            const userData = {
                id: refreshed.id,
                chatId: refreshed.chatId,
                username: refreshed.username,
                role: refreshed.role || 'user',
            };

            const cacheKey = `auth:user:${chatId}`;
            await this.cacheManager.del(cacheKey);
            await this.cacheManager.set(cacheKey, userData, 60 * 60);
            console.log('✅ Обновлён кэш:', cacheKey, userData);

            await this.botService.updateUser(chatId);
            return refreshed;
        } catch (e) {
            await this.botService.errorMessage(`Ошибка при обновлении роли: ${e}`);
            throw new HttpException(
                `Ошибка при обновлении роли: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }




    async search(query: string) {
        console.log('query', query);
        try {
            return await this.usersRepository.findAll({
                where: {
                    [Op.or]: [
                        {name: {[Op.iLike]: `%${query}%`}},
                        {username: {[Op.iLike]: `%${query}%`}},
                        {email: {[Op.iLike]: `%${query}%`}},
                        {chatId: {[Op.iLike]: `%${query}%`}}, // если chatId — string
                    ],
                },
            });
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при поиске пользователя: ${e}`);
            throw new HttpException(
                `Произошла ошибка при поиске пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAllByRole(role: string) {
        try {
            return await this.usersRepository.findAll({where: {role}});
        } catch (e) {
            await this.botService.errorMessage(`Ошибка при получении пользователей по роли: ${e}`);
            throw new HttpException(
                `Ошибка при получении пользователей по роли: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
