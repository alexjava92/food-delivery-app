import {Column, DataType, HasMany, Model, Table,} from 'sequelize-typescript';
import {ApiProperty} from '@nestjs/swagger';
import {OrdersModel} from 'src/orders/orders.model';


@Table({tableName: 'users'})
export class UsersModel extends Model<UsersModel> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true,})
    id: number;

    @ApiProperty({example: '1111111 ', description: 'ID чата с ботом'})
    @Column({type: DataType.STRING, allowNull: false})
    chatId: string;

    @ApiProperty({example: 'Ivan', description: 'Ник пользователя'})
    @Column({type: DataType.STRING, allowNull: true})
    username: string;

    @ApiProperty({example: 'Ivan', description: 'Ник пользователя'})
    @Column({type: DataType.TEXT, allowNull: true})
    firstname: string;

    @ApiProperty({example: 'Ivan', description: 'Ник пользователя'})
    @Column({type: DataType.TEXT, allowNull: true})
    lastname: string;

    @ApiProperty({example: 'queryId', description: 'queryId'})
    @Column({type: DataType.TEXT, allowNull: false})
    queryId: string;

    @ApiProperty({example: 'user', description: 'Роль пользователя'})
    @Column({type: DataType.STRING, allowNull: false, defaultValue: 'user'})
    role?: string;

    @ApiProperty({example: 'Иван', description: 'Имя пользователя'})
    @Column({type: DataType.STRING, allowNull: true})
    name: string;

    @ApiProperty({example: 'email', description: 'email@email'})
    @Column({type: DataType.STRING, allowNull: true})
    email: string;

    @ApiProperty({example: 'Пол', description: 'Мужской'})
    @Column({type: DataType.STRING, allowNull: true})
    gender: string;

    @ApiProperty({example: 'Дата рождения', description: '01.01.2024'})
    @Column({type: DataType.STRING, allowNull: true})
    birthdate: string;

    @ApiProperty({example: 'Телефон', description: '+71111111111'})
    @Column({type: DataType.STRING, allowNull: true})
    phone: string;

    @ApiProperty({example: 'Адрес', description: 'ул. Ленинаб д1, кв1'})
    @Column({type: DataType.STRING, allowNull: true})
    address: string;

    @HasMany(() => OrdersModel)
    order: OrdersModel[];
}
