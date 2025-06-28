import {Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors,} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {CategoriesService} from './categories.service';
import {CategoriesModel} from './categories.model';
import {CategoriesDto} from './categories.dto';
import {JwtAuthGuard} from "../auth/auth.guard";

@ApiTags('Категории')
@Controller('api/categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {
    }

    @ApiOperation({summary: 'Создание категории продукта'})
    @ApiResponse({status: 200, type: CategoriesModel})
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() dto: CategoriesDto, @UploadedFile() image: any) {
        return this.categoriesService.createCategories(dto, image);
    }

    @ApiOperation({summary: 'Получение всех категорий'})
    @ApiResponse({status: 200, type: [CategoriesModel]})
    @Get()
    async findAll() {
        return this.categoriesService.getAllCategories();
    }

    @ApiOperation({summary: 'Получение категории по идентификатору'})
    @ApiResponse({status: 200, type: CategoriesModel})
    @Get(':id')
    async findOne(@Param('id') id: string) {
        console.time(`🔁 /category/${id}`);
        const result = await this.categoriesService.getCategoryById(+id);
        console.timeEnd(`🔁 /category/${id}`);
        return result;
    }

    @ApiOperation({summary: 'Частичное изменение категории'})
    @ApiResponse({status: 200, type: CategoriesModel})
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Body() dto: CategoriesDto,
        @Param('id') id: string,
        @UploadedFile() image,
    ) {
        return this.categoriesService.updateCategory(+id, dto, image);
    }

    @ApiOperation({summary: 'Удаление категории'})
    @ApiResponse({status: 200})
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.categoriesService.deleteCategory(+id);
    }
}
