import {MainLayout} from "../../layout/mainLayout"
import classes from "./oneOrderPage.module.scss";
import React from "react";
import {NavLink, useParams} from "react-router-dom";
import {useGetOneOrderQuery} from "../../store/API/ordersApi";
import {Product} from "../../entities/product/product";
import {Loader} from "../../shared/loader/loader";

const OneOrderPage = () => {
    const {id} = useParams()
    const {data, error, isLoading} = useGetOneOrderQuery(`${id}`)

    if (error) return <h2 className={'error'}>Данные о товаре не загружены</h2>

    const productsTotal = data?.orderProducts?.reduce((acc, item) =>
        acc + (+item?.price * (item.count ? item.count : 0)), 0
    ) || 0;

    const delivery = data?.typeDelivery === 'Доставка' ? (data?.deliveryPrice || 0) : 0;
    const total = productsTotal + delivery;

    return (
        <MainLayout heading={`Заказ №${id}`} textCenter>
            <div>
                <div className={classes.products}>
                    {isLoading && <Loader height={86}/>}
                    {
                        data?.orderProducts?.map(item =>
                            <Product key={item.id} data={item} inOrder/>
                        )
                    }
                </div>

                <div className={classes.sum}>
                    <div><span>Сумма товаров:</span><span>{productsTotal} ₽</span></div>
                    {data?.typeDelivery === 'Доставка' && (
                        <div><span>Доставка:</span><span>{delivery} ₽</span></div>
                    )}
                    <div><b><span>Итого: </span><span>{total} ₽</span></b></div>
                </div>

                <div className={classes.desc}>
                    <div><span>Информация о заказе</span></div>
                    {data?.typeDelivery !== 'Самовывоз' && (
                        <div><span>Адрес: </span>{data?.address}</div>
                    )}
                    <div><span>Имя: </span>{data?.name}</div>
                    <div><span>Телефон: </span>{data?.phone}</div>
                    <div><span>Тип доставки: </span>{data?.typeDelivery}</div>
                    {data?.typeDelivery !== 'Самовывоз' && (
                        <div><span>Метод оплаты: </span>{data?.paymentMethod}</div>
                    )}
                    <div><span>Комментарий: </span>{data?.comment}</div>
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
