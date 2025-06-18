import {  Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'welcomeMessage' })
export class TextMessageModel extends Model {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true,})
  id: number;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue:'Hello' })
  text: string;

  @Column({ type: DataType.STRING, allowNull: false })
  type: string;
}
