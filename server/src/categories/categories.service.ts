import {

    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoriesModel } from './categories.model';
import { FileService } from '../file/file.service';
import { CategoriesDto } from './categories.dto';
import { ProductsModel } from '../products/products.model';
import { BotService } from '../bot/bot.service';
import { Cache } from 'cache-manager';
import {CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(CategoriesModel)
        private categoriesRepository: typeof CategoriesModel,
        private fileService: FileService,
        private readonly botService: BotService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async createCategories(dto: CategoriesDto, image: string) {
        try {
            const fileName = await this.fileService.createFile(image);
            const category = await this.categoriesRepository.create({
                ...dto,
                image: fileName,
            });
            await this.cacheManager.del('categories:all'); // очистка кэша
            return category;
        } catch (e) {
            await this.botService.errorMessage(
                `Произошла ошибка при создании категории: ${e}`,
            );
            throw new HttpException(
                `Произошла ошибка при создании категории: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAllCategories(): Promise<CategoriesModel[]> {
        try {
            const cacheKey = 'categories:all';
            const cached = await this.cacheManager.get<CategoriesModel[]>(cacheKey);
            if (cached) {
                console.log('→ FROM CACHE');
                return cached;
            }

            console.log('→ FROM DB, writing to Redis');
            const categories = await this.categoriesRepository.findAll();
            try {
                // Преобразуем в чистый JSON
                const plainCategories = categories.map(category => category.get({ plain: true }));
                await this.cacheManager.set(cacheKey, plainCategories, 3600);
                console.log('→ Cache set successfully');
            } catch (cacheError) {
                console.error('Redis write error:', cacheError);
            }
            return categories;
        } catch (e) {
            await this.botService.errorMessage(
                `Произошла ошибка при получении категорий: ${e}`,
            );
            throw new HttpException(
                `Произошла ошибка при получении категорий: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getCategoryById(id: number): Promise<CategoriesModel> {
        try {
            const cacheKey = `category:${id}`;
            const cached = await this.cacheManager.get<CategoriesModel>(cacheKey);
            if (cached) return cached;

            const category = await this.categoriesRepository.findOne({
                where: { id },
                include: ProductsModel,
            });

            if (category) {
                await this.cacheManager.set(cacheKey, category.get({ plain: true }), 60 * 60); // 1 час
            }

            return category;
        } catch (e) {
            await this.botService.errorMessage(
                `Произошла ошибка при получении категории: ${e}`,
            );
            throw new HttpException(
                `Произошла ошибка при получении категории: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    async updateCategory(id: number, dto: CategoriesDto, image: string) {
        try {
            const category = await this.categoriesRepository.findOne({
                where: { id },
            });
            const fileName = image
                ? await this.fileService.createFile(image)
                : category.dataValues.image;
            const updated = await category.update({ ...dto, image: fileName });
            await this.cacheManager.del('categories:all'); // очистка кэша
            return updated;
        } catch (e) {
            await this.botService.errorMessage(
                `Произошла ошибка при обновлении категории: ${e}`,
            );
            throw new HttpException(
                `Произошла ошибка при обновлении категории: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteCategory(id: number): Promise<void> {
        try {
            const category = await this.getCategoryById(id);
            await category.destroy();
            await this.cacheManager.del('categories:all'); // очистка кэша
        } catch (e) {
            await this.botService.errorMessage(
                `Произошла ошибка при удалении категории: ${e}`,
            );
            throw new HttpException(
                `Произошла ошибка при удалении категории: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
