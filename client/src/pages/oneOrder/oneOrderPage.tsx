import {MainLayout} from "../../layout/mainLayout";
import classes from "./oneOrderPage.module.scss";
import React from "react";
import {NavLink, useParams} from "react-router-dom";
import {useGetOneOrderQuery} from "../../store/API/ordersApi";
import {Product} from "../../entities/product/product";
import {Loader} from "../../shared/loader/loader";
import {IProduct} from "../../types/types";

const OneOrderPage = () => {
    const {id} = useParams();
    const {data, error, isLoading} = useGetOneOrderQuery(`${id}`, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 5000,
    });

    if (error) return <h2 className={'error'}>Данные о заказе не загружены</h2>;

    const productsTotal = data?.orderProducts?.reduce((acc, item) => {
        const enrichedItem = item as IProduct & {
            order_product?: { count?: number };
            OrderProductsModel?: { count?: number };
        };

        const count =
            enrichedItem.OrderProductsModel?.count ||
            enrichedItem.order_product?.count ||
            enrichedItem.count ||
            1;

        const price = Number(enrichedItem.price) || 0;
        return acc + (price * count);
    }, 0) || 0;


    const delivery = data?.typeDelivery === 'Доставка' ? (data?.deliveryPrice || 0) : 0;
    const total = productsTotal + delivery;


    return (
        <MainLayout heading={`Заказ №${id}`} textCenter>
            <div className={classes.oneOrderCard}>
                <div className="borderContainer">
                    <div className={classes.products}>
                        {isLoading && <Loader height={86}/>}
                        {
                            data?.orderProducts?.map(item =>
                                <Product key={item.id} data={item} inOrder/>
                            )
                        }
                    </div>
                </div>
                <div className="borderContainer">
                    <div className={classes.sum}>
                        <div><span>Сумма товаров:</span><span>{productsTotal} ₽</span></div>
                        {data?.typeDelivery === 'Доставка' && (
                            <div><span>Доставка:</span><span>{delivery} ₽</span></div>
                        )}
                        <div><b><span>Итого: </span><span>{total} ₽</span></b></div>
                    </div>
                </div>
                <div className="borderContainer">
                    <div className={classes.desc}>
                        <div>Информация о заказе</div>
                        <div><span>Статус:</span> {data?.status}</div>
                        {data?.typeDelivery !== 'Самовывоз' && (
                            <div><span>Адрес:</span> {data?.address}</div>
                        )}
                        <div><span>Имя:</span> {data?.name}</div>
                        <div><span>Телефон:</span> {data?.phone}</div>
                        <div><span>Тип доставки:</span> {data?.typeDelivery}</div>
                        {data?.typeDelivery !== 'Самовывоз' && (
                            <div><span>Метод оплаты:</span> {data?.paymentMethod}</div>
                        )}
                        <div><span>Комментарий:</span> {data?.comment}</div>
                    </div>
                </div>
            </div>

            <NavLink className={classes.link} to={'/orders'}>
                <span className={classes.line}></span>
                <span>Смотреть&nbsp;все&nbsp;заказы</span>
                <span className={classes.line}></span>
            </NavLink>
        </MainLayout>
    );
};

export default OneOrderPage;