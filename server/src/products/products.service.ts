import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsModel } from './products.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProductsDto } from './products.dto';
import { FileService } from '../file/file.service';
import {BotService} from "../bot/bot.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductsModel)
    private ProductsRepository: typeof ProductsModel,
    private fileService: FileService,
    private readonly botService: BotService
  ) {}

  async createProduct(dto: ProductsDto, file: string) {
    try {
      const fileName = await this.fileService.createFile(file);
      return await this.ProductsRepository.create({...dto,image: fileName,});
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при создании продукта: ${e}`)
      throw new HttpException(
        `Произошла ошибка при создании продукта: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProducts() {
    try {
      return await this.ProductsRepository.findAll();
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при получении продукта: ${e}`)
      throw new HttpException(
        `Произошла ошибка при получении продукта: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneProduct(id: number) {
    try {
      return await this.ProductsRepository.findByPk(id);
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при получении продукта: ${e}`)
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
      return product;
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при обновлении продукта: ${e}`)
      throw new HttpException(
        `Произошла ошибка при обновлении продукта: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const product = await this.ProductsRepository.findByPk(id);
     return await product.destroy();
    } catch (e) {
      await this.botService.errorMessage(`Произошла ошибка при удалении продукта: ${e}`)
      throw new HttpException(
        'Произошла ошибка при удалении продукта',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
