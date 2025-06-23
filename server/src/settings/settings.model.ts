import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'settings' })
export class SettingsModel extends Model<SettingsModel> {
    @Column({ type: DataType.STRING, primaryKey: true })
    key: string;

    @Column({ type: DataType.STRING })
    value: string;
}
