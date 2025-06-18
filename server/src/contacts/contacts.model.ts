import {  Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'contacts' })
export class ContactsModel extends Model {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true,})
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string

  @Column({ type: DataType.STRING, allowNull: false })
  worktime: string

  @Column({ type: DataType.STRING, allowNull: false })
  phone: string

}
