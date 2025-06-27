import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {TokenService} from "../token/token.service";
import {UsersDto} from "../users/users.dto";
import {BotService} from "../bot/bot.service";
import {UsersModel} from "../users/users.model";
import {InjectModel} from "@nestjs/sequelize";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService,
        private botService: BotService,
        @InjectModel(UsersModel) private usersRepository: typeof UsersModel,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async authentication(dto: UsersDto) {
        try {
            const cacheKey = `auth:user:${dto.chatId}`;

            // 1. Проверка кэша
            const cachedUser = await this.cacheManager.get<any>(cacheKey);
            if (cachedUser) {
                console.log('→ FROM AUTH CACHE');
                return {
                    ...cachedUser,
                    access_token: await this.tokenService.generateJwtToken({
                        chatId: dto.chatId,
                        role: cachedUser.role,
                    }),
                };
            }

            // 2. Поиск или создание пользователя
            const existUser = await this.usersService.findOne(`${dto.chatId}`);
            const payload = { chatId: dto.chatId };

            if (!existUser) {
                const user = await this.usersService.createUser(dto);
                const { id, chatId, username, role } = user;
                const userData = { id, chatId, username, role: role || 'user' };

                // Сохраняем в Redis
                await this.cacheManager.set(cacheKey, userData, 60 * 60);

                return {
                    ...userData,
                    access_token: await this.tokenService.generateJwtToken({
                        ...payload,
                        role: userData.role,
                    }),
                };
            } else {
                const user = await this.usersRepository.findByPk(existUser.id);
                await user.update(dto);

                const userData = {
                    id: user.id,
                    chatId: user.chatId,
                    username: user.username,
                    role: user.role,
                };

                await this.cacheManager.set(cacheKey, userData, 60 * 60);

                return {
                    ...userData,
                    access_token: await this.tokenService.generateJwtToken({
                        ...payload,
                        role: user.role,
                    }),
                };
            }
        } catch (e) {
            await this.botService.errorMessage(
                `Произошла ошибка при создании или авторизации пользователя: ${e}`,
            );
            throw new HttpException(
                `Произошла ошибка при создании или авторизации пользователя: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}