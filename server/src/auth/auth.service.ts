import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { UsersDto } from '../users/users.dto';
import { BotService } from '../bot/bot.service';
import { UsersModel } from '../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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
            const cacheKey = `user:${dto.chatId}`;
            // Проверяем кэш
            const cachedUser = await this.cacheManager.get<UsersModel>(cacheKey);
            if (cachedUser) {
                console.log('→ User from cache');
                const payload = { chatId: dto.chatId };
                return {
                    id: cachedUser.id,
                    chatId: cachedUser.chatId,
                    username: cachedUser.username,
                    access_token: await this.tokenService.generateJwtToken({
                        ...payload,
                        role: cachedUser.role,
                    }),
                };
            }

            console.log('→ User from DB, writing to Redis');
            const existUser = await this.usersService.findOne(`${dto.chatId}`);
            const payload = { chatId: dto.chatId };

            if (!existUser) {
                const user = await this.usersService.createUser(dto);
                const { id, chatId, username } = user;
                // Кэшируем нового пользователя
                await this.cacheManager.set(
                    cacheKey,
                    { id, chatId, username, role: 'user' },
                    3600,
                );
                return {
                    id,
                    chatId,
                    username,
                    access_token: await this.tokenService.generateJwtToken({
                        ...payload,
                        role: 'user',
                    }),
                };
            } else {
                const user = await this.usersRepository.findByPk(existUser.id);
                await user.update(dto);
                // Кэшируем обновленного пользователя
                await this.cacheManager.set(
                    cacheKey,
                    {
                        id: user.id,
                        chatId: user.chatId,
                        username: user.username,
                        role: user.role,
                    },
                    3600,
                );
                return {
                    id: user.id,
                    chatId: user.chatId,
                    username: user.username,
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