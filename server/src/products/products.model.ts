import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table,} from 'sequelize-typescript';
import {ApiProperty} from '@nestjs/swagger';
import {CategoriesModel} from '../categories/categories.model';
import {OrdersModel} from 'src/orders/orders.model';
import {OrderProductsModel} from 'src/orders/ordersProducts.model';

interface ProductsCreateAttrs {
    title: string;
    price: string;
    image: string;
    userName: string;
    description: string;
    favourites?: boolean;
    categoryId: number;
    count: number;
    disabled: boolean;
    grams: string;
}

@Table({tableName: 'products'})
export class ProductsModel extends Model<ProductsModel, ProductsCreateAttrs> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true,})
    id: number;

    @ApiProperty({example: 'Мясной бургер ', description: 'Наименование продукта',})
    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @ApiProperty({example: '500 ', description: 'Цена'})
    @Column({type: DataType.STRING, allowNull: false})
    price: string;

    @ApiProperty({example: 'Изображение', description: 'Изображение'})
    @Column({type: DataType.STRING, allowNull: false})
    image: string;

    @ApiProperty({example: '@user', description: 'Имя пользователя добавившего продукт',})
    @Column({type: DataType.STRING, allowNull: false})
    userName: string;

    @ApiProperty({example: 'true', description: 'Добавлен ли продукт в избраное',})
    @Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: false})
    favourites: boolean;

    @ApiProperty({example: 'Краткое описание', description: 'Краткое описание'})
    @Column({type: DataType.STRING, allowNull: true})
    description: string;

    @ApiProperty({example: 'Краткое описание', description: 'Краткое описание'})
    @Column({type: DataType.STRING, allowNull: true})
    grams: string;

    @ApiProperty({example: 1, description: 'Количество товаров при заказе'})
    @Column({type: DataType.INTEGER, allowNull: true, defaultValue: 1})
    count: number;

    @ApiProperty({example: 'true', description: 'Активный товар'})
    @Column({type: DataType.BOOLEAN, allowNull: true, defaultValue: false})
    disabled: boolean;

    @ForeignKey(() => CategoriesModel)
    @Column({type: DataType.INTEGER, allowNull: false})
    categoryId: number;

    @BelongsTo(() => CategoriesModel)
    category: CategoriesModel;

    @BelongsToMany(() => OrdersModel, {
        through: () => OrderProductsModel,
        as: 'orders',
    })
    orders: OrdersModel[];
}
