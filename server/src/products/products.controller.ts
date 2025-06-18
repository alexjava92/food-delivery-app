import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ProductsService} from './products.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {ProductsDto} from './products.dto';
import {ProductsModel} from './products.model';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from "../auth/auth.guard";

@ApiTags('Продукты')
@Controller('/api/products')
export class ProductsController {
    constructor(private productsService: ProductsService) {
    }

    @ApiOperation({summary: 'Создание продукта'})
    @ApiResponse({status: 200, type: ProductsModel})
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() dto: ProductsDto, @UploadedFile() image) {
        return this.productsService.createProduct(dto, image);
    }

    @ApiOperation({summary: 'Получение всех продуктов'})
    @ApiResponse({status: 200, type: ProductsModel})
    @Get()
    getAll() {
        return this.productsService.getAllProducts();
    }

    @ApiOperation({summary: 'Получение продукта по ID'})
    @ApiResponse({status: 200, type: ProductsModel})
    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.productsService.getOneProduct(id);
    }

    @ApiOperation({summary: 'Удаление продукта'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.productsService.deleteProduct(id);
    }

    @ApiOperation({summary: 'Обновление продукта'})
    @ApiResponse({status: 200, type: ProductsModel})
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    update(@Param('id') id: number, @Body() dto: ProductsDto, @UploadedFile() image,) {
        return this.productsService.updateProduct(+id, dto, image);
    }
}
