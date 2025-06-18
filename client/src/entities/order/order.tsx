import React, {FC, memo} from "react";
import classes from './order.module.scss'
import {IOrder} from "../../types/types";


interface IType {
    data: IOrder
}

export const Order: FC<IType> = memo(({data}) => {
    return (
        <div className={classes.order}>
            <div className={classes.title}>
                <span>Заказ №{data?.id}</span>
                <span>{data?.sum}₽</span>
            </div>
            <div className={classes.box}>
                {
                    data.orderProducts.map(item =>
                        <span key={item.id} className={classes.text}>-{item.title}</span>
                    )
                }
            </div>
        </div>
    )
}) 
