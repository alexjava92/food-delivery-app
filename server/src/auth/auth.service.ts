import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { UsersDto } from '../users/users.dto';
import { BotService } from '../bot/bot.service';
import { UsersModel } from '../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService,
        private botService: BotService,
        @InjectModel(UsersModel)
        private usersRepository: typeof UsersModel,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    async authentication(dto: UsersDto) {
        try {
            const cacheKey = `auth:user:${dto.chatId}`;

            // 1. Попробовать получить из кэша
            const cachedUser = await this.cacheManager.get<any>(cacheKey);
            if (cachedUser && cachedUser.role) {
                console.log('→ FROM AUTH CACHE');
                return {
                    id: cachedUser.id,
                    chatId: cachedUser.chatId,
                    username: cachedUser.username,
                    role: cachedUser.role,
                    access_token: await this.tokenService.generateJwtToken({
                        chatId: cachedUser.chatId,
                        role: cachedUser.role,
                    }),
                };
            }

            const existUser = await this.usersService.findOne(`${dto.chatId}`);
            const payload = { chatId: dto.chatId };

            // 2. Если нет пользователя — создать нового
            if (!existUser) {
                const user = await this.usersService.createUser(dto);
                const userData = {
                    id: user.id,
                    chatId: user.chatId,
                    username: user.username,
                    role: user.role || 'user',
                };

                await this.cacheManager.set(cacheKey, userData, 60 * 60);

                return {
                    ...userData,
                    access_token: await this.tokenService.generateJwtToken({
                        ...payload,
                        role: userData.role,
                    }),
                };
            }

            // 3. Пользователь найден — обновить и вернуть
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
