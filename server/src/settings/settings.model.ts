import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    DataType,
    Model,
    Table,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'settings', timestamps: true })
export class SettingsModel extends Model<SettingsModel> {
    @ApiProperty({ example: 'maintenance', description: 'Ключ настройки' })
    @Column({ type: DataType.STRING, primaryKey: true })
    key: string;

    @ApiProperty({ example: 'true', description: 'Значение настройки (строка)' })
    @Column({ type: DataType.STRING })
    value: string;

    @ApiProperty({ example: '2025-06-23T18:00:00.000Z' })
    @CreatedAt
    @Column({ field: 'createdAt' })
    createdAt: Date;

    @ApiProperty({ example: '2025-06-23T18:30:00.000Z' })
    @UpdatedAt
    @Column({ field: 'updatedAt' })
    updatedAt: Date;
}
