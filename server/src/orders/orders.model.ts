import {Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany, BelongsToMany} from 'sequelize-typescript';
import {ApiProperty} from '@nestjs/swagger';
import {UsersModel} from 'src/users/users.model';
import {ProductsModel} from 'src/products/products.model';
import {OrderProductsModel} from './ordersProducts.model';

@Table({tableName: 'orders'})
export class OrdersModel extends Model {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'Доставка', description: 'Тип доставки'})
    @Column({type: DataType.STRING, allowNull: false})
    typeDelivery: string;

    @ApiProperty({example: 'Готов к выдаче', description: 'Статус заказа'})
    @Column({type: DataType.STRING, allowNull: false, defaultValue: 'новый'})
    status: string;

    @ApiProperty({example: false, description: 'Уведомления заказа'})
    @Column({type: DataType.BOOLEAN, allowNull: false, defaultValue: false})
    notifications: boolean;

    @ApiProperty({example: 'пер. Цветочный, д23, кв. 2', description: 'Адрес'})
    @Column({type: DataType.STRING, allowNull: false})
    address: string;

    @ApiProperty({example: 'Телефон', description: '+7 111 11 11 11'})
    @Column({type: DataType.STRING, allowNull: false})
    phone: string;

    @ApiProperty({example: 'Имя', description: 'Иван Иванович'})
    @Column({type: DataType.STRING, allowNull: false})
    name: string;

    @ApiProperty({example: 'Метод оплаты ', description: 'Наличные'})
    @Column({type: DataType.STRING, allowNull: false})
    paymentMethod: string;

    @ApiProperty({example: 'Комнтарий к заказу ', description: 'Комнтарий к заказу'})
    @Column({type: DataType.STRING, allowNull: true})
    comment: string;

    @BelongsToMany(() => ProductsModel, () => OrderProductsModel)
    orderProducts: Partial<ProductsModel>[];

    @ForeignKey(() => UsersModel)
    @Column({type: DataType.INTEGER, allowNull: false})
    userId: number;

    @BelongsTo(() => UsersModel)
    user: UsersModel;
}
