import {Column,DataType,Model,Table,ForeignKey} from 'sequelize-typescript';
import { ProductsModel } from 'src/products/products.model';
import { OrdersModel } from './orders.model';

@Table({ tableName: 'orders_products' })
export class OrderProductsModel extends Model {
  @Column({type: DataType.NUMBER,unique: true,autoIncrement: true, primaryKey: true,})
  id: number;

  @ForeignKey(() => OrdersModel)
  @Column({ type: DataType.NUMBER })
  orderId: number;

  @ForeignKey(() => ProductsModel)
  @Column({ type: DataType.NUMBER })
  products: number;

  @Column({ type: DataType.NUMBER })
  count: number;
}
