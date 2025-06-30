import {Column, DataType, Model, Table, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { ProductsModel } from 'src/products/products.model';
import { OrdersModel } from './orders.model';

@Table({ tableName: 'orders_products' })
export class OrderProductsModel extends Model {
  @Column({type: DataType.INTEGER,unique: true,autoIncrement: true, primaryKey: true,})
  id: number;

  @ForeignKey(() => OrdersModel)
  @Column({ type: DataType.INTEGER })
  orderId: number;

  @ForeignKey(() => ProductsModel)
  @Column({ type: DataType.INTEGER })
  products: number;

  @Column({ type: DataType.INTEGER })
  count: number;

  @BelongsTo(() => OrdersModel)
  order: OrdersModel;

  @BelongsTo(() => ProductsModel)
  product: ProductsModel;
}
