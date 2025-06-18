import {useGetOrdersQuery} from "../../store/API/ordersApi";
import classes from "../../widgets/orders/orders.module.scss";
import {Loader} from "../../shared/loader/loader";
import {NavLink} from "react-router-dom";
import {Order} from "../../entities/order/order";
import React, {useState} from "react";
import {Button} from "../../shared/button/button";
import {MainLayout} from "../../layout/mainLayout";


const AllOrdersPage = () => {
    const [page, setPage] = useState(1)
    const {data, isError, isLoading} = useGetOrdersQuery(page)

    return (
        <MainLayout heading={'Все заказы'} textCenter>
            <div className={classes.orders}>
                {isLoading && <Loader height={75}/>}
                {
                    data?.rows?.length ? data?.rows?.map(item =>
                            <NavLink key={item.id} to={`/order/${item.id}`}>
                                <Order data={item}/>
                            </NavLink>
                        ) :
                        <div>Заказов не найдено</div>
                }
                <Button onClick={() => setPage(page + 1)}>Показать еще</Button>
            </div>
        </MainLayout>
    )
};
export default AllOrdersPage;
