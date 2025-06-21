import classes from './notificationPage.module.scss';
import { MainLayout } from "../../layout/mainLayout";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import {
    useGetAllOrdersUserQuery,
    useUpdateOrderNotificationMutation,
} from "../../store/API/ordersApi";
import React, { useEffect } from "react";
import { Button } from "../../shared/button/button";
import { NavLink } from "react-router-dom";
import { setUnreadCount } from "../../store/slice/notificationSlice";

const NotificationPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.userReducer);

    const { data } = useGetAllOrdersUserQuery(`${user?.id}`, {
        skip: !user?.id,
    });

    const [updateStatus] = useUpdateOrderNotificationMutation();

    useEffect(() => {
        if (data) {
            const count = data.filter(item => item.notifications).length;
            dispatch(setUnreadCount(count));
        }
    }, [data]);

    const handler = async (orderId: number | string) => {
        await updateStatus({
            id: orderId,
            body: {
                notifications: false
            }
        });
        // Обновление состояния произойдёт через useEffect после обновления данных
    };

    return (
        <MainLayout heading={'Уведомления'}>
            <div className={classes.list}>
                {data?.length &&
                    data.map(item =>
                            item.notifications && (
                                <div className={classes.item} key={item.id}>
                                    <div className={classes.box}>
                                        <div className={classes.text}>Заказ №{item.id}</div>
                                        <div className={classes.value}>{item.status}</div>
                                    </div>
                                    <div className={classes.box}>
                                        <NavLink className={classes.link} to={`/order/${item.id}`}>
                                            Перейти в заказ
                                        </NavLink>
                                        <Button onClick={() => handler(item.id)}>Прочитать</Button>
                                    </div>
                                </div>
                            )
                    )}
            </div>
        </MainLayout>
    );
};

export default NotificationPage;
