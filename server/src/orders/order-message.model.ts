import { Column, DataType, Model, Table, ForeignKey } from 'sequelize-typescript';
import { OrdersModel } from './orders.model';

@Table({ tableName: 'order_messages', timestamps: true })
export class OrderMessageModel extends Model {
    @ForeignKey(() => OrdersModel)
    @Column({ type: DataType.INTEGER })
    orderId: number;

    @Column({ type: DataType.BIGINT })
    chatId: number;

    @Column({ type: DataType.INTEGER })
    messageId: number;

    @Column({ type: DataType.DATE })
    createdAt: Date;

    @Column({ type: DataType.DATE })
    updatedAt: Date;
}
