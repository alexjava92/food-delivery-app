import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsModel } from './products.model';
import { ProductsDto } from './products.dto';
import { FileService } from '../file/file.service';
import { BotService } from '../bot/bot.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductsService {
  constructor(
      @InjectModel(ProductsModel)
      private ProductsRepository: typeof ProductsModel,
      private fileService: FileService,
      private readonly botService: BotService,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createProduct(dto: ProductsDto, file: string) {
    try {
      const fileName = await this.fileService.createFile(file);
      const product = await this.ProductsRepository.create({ ...dto, image: fileName });

      // Очистить общий кэш продуктов
      await this.cacheManager.del('products:all');
      return product;
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при создании продукта: ${e}`);
      throw new HttpException(
          `Произошла ошибка при создании продукта: ${e}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProducts() {
    const cacheKey = 'products:all';
    try {
      console.time(`⏱️ Redis get [${cacheKey}]`);
      const cached = await this.cacheManager.get<ProductsModel[]>(cacheKey);
      console.timeEnd(`⏱️ Redis get [${cacheKey}]`);

      if (cached) {
        console.log(`📦 [${cacheKey}] → FROM CACHE`);
        return cached;
      }

      console.log(`💾 [${cacheKey}] → FROM DB`);
      const products = await this.ProductsRepository.findAll();
      const plain = products.map(p => p.get({ plain: true }));

      await this.cacheManager.set(cacheKey, plain, 60 * 60);
      console.log(`✅ [${cacheKey}] → WRITTEN TO CACHE`);

      return products;
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при получении продукта: ${e}`);
      throw new HttpException(
          `Произошла ошибка при получении продукта: ${e}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneProduct(id: number) {
    const cacheKey = `product:${id}`;
    try {
      console.time(`⏱️ Redis get [${cacheKey}]`);
      const cached = await this.cacheManager.get<ProductsModel>(cacheKey);
      console.timeEnd(`⏱️ Redis get [${cacheKey}]`);

      if (cached) {
        console.log(`📦 [${cacheKey}] → FROM CACHE`);
        return cached;
      }

      console.log(`💾 [${cacheKey}] → FROM DB`);
      const product = await this.ProductsRepository.findByPk(id);

      if (product) {
        const plain = product.get({ plain: true });
        await this.cacheManager.set(cacheKey, plain, 60 * 60);
        console.log(`✅ [${cacheKey}] → WRITTEN TO CACHE`);
      }

      return product;
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при получении продукта: ${e}`);
      throw new HttpException(
          `Произошла ошибка при получении продукта: ${e}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProduct(id: number, dto: ProductsDto, image) {
    try {
      const product = await this.ProductsRepository.findOne({ where: { id } });
      const fileName = image ? await this.fileService.createFile(image) : product.dataValues.image;

      await product.update({ ...dto, image: fileName });

      // Очистить кэш по ID и общий
      await this.cacheManager.del('products:all');
      await this.cacheManager.del(`product:${id}`);
      await this.cacheManager.del(`category:${product.categoryId}`);

      return product;
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при обновлении продукта: ${e}`);
      throw new HttpException(
          `Произошла ошибка при обновлении продукта: ${e}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const product = await this.ProductsRepository.findByPk(id);
      if (!product) throw new Error('Product not found');

      await product.destroy();

      await this.cacheManager.del('products:all');
      await this.cacheManager.del(`product:${id}`);
      await this.cacheManager.del('categories:all');

      console.log(`🗑️ Удалён продукт ${id}, кэш очищен`);
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при удалении продукта: ${e}`);
      throw new HttpException(
          'Произошла ошибка при удалении продукта',
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
