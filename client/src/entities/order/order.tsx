import React, { FC, memo } from "react";
import classes from './order.module.scss'
import { IOrder } from "../../types/types";

interface IType {
    data: IOrder
}

export const Order: FC<IType> = memo(({ data }) => {
    const totalSum = data.orderProducts.reduce((acc, item) => {
        const count = item?.OrderProductsModel?.count ?? 1;
        return acc + Number(item.price) * count;
    }, 0);

    const formattedDate = new Date(data.createdAt || "").toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className={classes.order}>
            <div className={classes.title}>
                <span>Заказ №{data?.id}</span>
                <span>{totalSum}₽</span>
            </div>
            <div className={classes.date}>
                <span>Дата: {formattedDate}</span>
            </div>
            <div className={classes.box}>
                {
                    data.orderProducts.map(item =>
                        <span key={item.id} className={classes.text}>- {item.title}</span>
                    )
                }
            </div>
        </div>
    );
});
