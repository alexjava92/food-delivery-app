import {Injectable} from '@nestjs/common';
import {ProductsModel} from 'src/products/products.model';
import {Op} from 'sequelize';
import {BotService} from "../bot/bot.service";
import {CategoriesModel} from "../categories/categories.model";

@Injectable()
export class SearchService {
    constructor(private readonly botService: BotService) {
    }

    async search(query: string) {
        try {
            const products = await ProductsModel.findAll({
                where: {title: {[Op.iLike]: `%${query["search"]}%`}},
            });
            const categories = await CategoriesModel.findAll({
                where: {title: {[Op.iLike]: `%${query["search"]}%`}},
                include: {all: true}
            });

            let productsInCategories = []
            for (let item of categories) {
                for (let product of item.products) {
                    if (!products.find(prod => prod.id == product.id)) {
                        productsInCategories.push(product)
                    }
                }
            }
            return [...productsInCategories, ...products];
        } catch (e) {
            await this.botService.errorMessage(`Произошла ошибка при поиске: ${e}`)
        }
    }
}
