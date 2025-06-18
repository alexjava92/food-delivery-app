import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CategoriesModel} from './categories.model';
import {InjectModel} from '@nestjs/sequelize';
import {FileService} from '../file/file.service';
import {CategoriesDto} from './categories.dto';
import {ProductsModel} from '../products/products.model';
import {BotService} from "../bot/bot.service";


@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(CategoriesModel)
        private categoriesRepository: typeof CategoriesModel,
        private fileService: FileService,
        private readonly botService: BotService
    ) {
    }

    async createCategories(dto: CategoriesDto, image: string) {
        try {
            const fileName = await this.fileService.createFile(image);
            return await this.categoriesRepository.create({...dto, image: fileName});
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при создании категории: ${e}`)
            throw new HttpException(
                `Произошла ошибка при создании категории: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getAllCategories(): Promise<CategoriesModel[]> {
        try {
            return this.categoriesRepository.findAll();
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении категорий: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении категорий: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getCategoryById(id: number): Promise<CategoriesModel> {
        try {
            return await this.categoriesRepository.findOne({where: {id}, include: ProductsModel});
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при получении категории: ${e}`)
            throw new HttpException(
                `Произошла ошибка при получении категории : ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async updateCategory(id: number, dto: CategoriesDto, image: string) {
        try {
            const category = await this.categoriesRepository.findOne({where: {id}});
            const fileName = image ? await this.fileService.createFile(image) : category.dataValues.image;
            return await category.update({...dto, image: fileName});
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при обновлении категории: ${e}`)
            throw new HttpException(
                `Произошла ошибка при обновлении категории: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteCategory(id: number): Promise<void> {
        try {
            const category = await this.getCategoryById(id);
           return await category.destroy();
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при удалении категории: ${e}`)
            throw new HttpException(
                `Произошла ошибка при удалении категории: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
