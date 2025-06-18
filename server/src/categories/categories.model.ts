import { HasMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ProductsModel } from '../products/products.model';

@Table({ tableName: 'categories' })
export class CategoriesModel extends Model {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true,})
  id: number;

  @ApiProperty({ example: 'Бургеры', description: 'Наименование категории' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({ example: 'Изображение', description: 'Изображение' })
  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @ApiProperty({example: '@user', description: 'Имя пользователя добавившего категорию',})
  @Column({ type: DataType.STRING, allowNull: true })
  userName: string;

  @HasMany(() => ProductsModel)
  products: ProductsModel[];
}
