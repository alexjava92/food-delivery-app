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
            console.time('🕒 getAllCategories');
            const cacheKey = 'categories:all';

            console.time('📦 Redis GET');
            const cached = await this.cacheManager.get<CategoriesModel[]>(cacheKey);
            console.timeEnd('📦 Redis GET');

            if (cached) {
                console.log('→ FROM CACHE');
                console.timeEnd('🕒 getAllCategories');
                return cached;
            }

            console.log('→ FROM DB, writing to Redis');

            console.time('💾 DB Query');
            const categories = await this.categoriesRepository.findAll();
            console.timeEnd('💾 DB Query');

            try {
                console.time('🧱 Serialize + Redis SET');
                const plainCategories = categories.map(category =>
                    category.get({ plain: true })
                );
                await this.cacheManager.set(cacheKey, plainCategories, 3600);
                console.timeEnd('🧱 Serialize + Redis SET');
                console.log('→ Cache set successfully');
            } catch (cacheError) {
                console.error('Redis write error:', cacheError);
            }

            console.timeEnd('🕒 getAllCategories');
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
            console.time(`⏱️ Redis get [${cacheKey}]`);
            const cached = await this.cacheManager.get<CategoriesModel>(cacheKey);
            console.timeEnd(`⏱️ Redis get [${cacheKey}]`);

            if (cached) {
                console.log(`📦 [category:${id}] → FROM CACHE`);
                return cached;
            }

            console.log(`💾 [category:${id}] → FROM DB`);
            const category = await this.categoriesRepository.findOne({
                where: { id },
                include: ProductsModel,
            });

            if (category) {
                const plain = JSON.parse(JSON.stringify(category));
                await this.cacheManager.set(cacheKey, plain, 60 * 60);
                console.log(`✅ [category:${id}] → WRITTEN TO CACHE`);
            } else {
                console.log(`⚠️ [category:${id}] → NOT FOUND in DB`);
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
            const category = await this.categoriesRepository.findByPk(id);
            if (!category) throw new Error('Category not found');

            await category.destroy();

            // Очистка общего кэша и кэша конкретной категории
            await this.cacheManager.del('categories:all');
            await this.cacheManager.del(`category:${id}`);

            console.log(`🗑️ Удалена категория ${id}, кэш очищен`);

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
