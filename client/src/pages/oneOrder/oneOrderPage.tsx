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

    return (
        <MainLayout heading={`Заказ №${id}`} textCenter>
            <div>
                <div className={classes.products}>
                    {isLoading && <Loader height={86}/>}
                    {
                        data && data?.orderProducts.map(item =>
                            <Product key={item.id} data={item} inOrder/>
                        )
                    }
                </div>
                <div className={classes.sum}>
                    <span>Итого:</span>
                    <span>
                         {
                             data?.orderProducts &&
                             data?.orderProducts.reduce((acc, item) =>
                                 acc + (+item?.price * (item.count ? item.count : 0)), 0)
                         }
                        ₽
                    </span>
                </div>
                <div className={classes.desc}>
                    <div><span>Информация о заказе</span></div>
                    <div><span>Адрес: </span>{data?.address}</div>
                    <div><span>Имя: </span>{data?.name}</div>
                    <div><span>Телефон: </span>{data?.phone}</div>
                    <div><span>Тип доставки: </span>{data?.typeDelivery}</div>
                    <div><span>Метод оплаты: </span>{data?.paymentMethod}</div>
                    <div><span>Коментарий: </span>{data?.comment}</div>
                </div>
            </div>
            <NavLink className={classes.link} to={'/orders'}>
                <span className={classes.line}></span>
                <span>Смотреть&nbsp;все&nbsp;заказы</span>
                <span className={classes.line}></span>
            </NavLink>
        </MainLayout>
    )
        ;
};
export default OneOrderPage;
