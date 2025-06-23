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
    @Column({ type: DataType.STRING, primaryKey: true })
    key: string;

    @Column({ type: DataType.STRING })
    value: string;

    @CreatedAt
    @Column({ field: 'createdAt' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updatedAt' })
    updatedAt: Date;
}
