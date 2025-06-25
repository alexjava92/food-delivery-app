import classes from './notificationPage.module.scss';
import { MainLayout } from "../../layout/mainLayout";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import {
    useGetAllOrdersUserQuery,
    useUpdateOrderNotificationMutation,
} from "../../store/API/ordersApi";
import React, { useEffect, useState } from "react";
import { Button } from "../../shared/button/button";
import { NavLink } from "react-router-dom";
import { setUnreadCount } from "../../store/slice/notificationSlice";

const NotificationPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.userReducer);
    const userId = user?.id ?? 0;

    const { data = [], isLoading } = useGetAllOrdersUserQuery(userId, {
        skip: !user?.id,
    });

    const [updateStatus] = useUpdateOrderNotificationMutation();
    const [readIds, setReadIds] = useState<any[]>([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (data) {
            const count = data.filter(item => item.notifications && !readIds.includes(item.id)).length;
            dispatch(setUnreadCount(count));
        }
    }, [data, readIds, dispatch]);

    const handleRead = async (orderId: string|number) => {
        setReadIds(prev => [...prev, orderId]);
        await updateStatus({ id: orderId, body: { notifications: false } });
    };

    const filteredData = showAll ? data : data.filter(item => item.notifications && !readIds.includes(item.id));

    return (
        <>
            <MainLayout heading="Уведомления">
                <div className={classes.toggle}>
                    <button onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Показать непрочитанные' : 'Показать все'}
                    </button>
                </div>
                <div className={classes.list}>
                    {isLoading ? (
                        <div className={classes.loader}>Загрузка...</div>
                    ) : (
                        filteredData.length > 0 ? filteredData.map(item => (
                            <div
                                className={`${classes.item} ${readIds.includes(item.id) ? classes.read : classes.unread}`}
                                key={item.id}
                            >
                                <div className={classes.box}>
                                    <div className={classes.text}>Заказ №{item.id}</div>
                                    <div className={classes.value}>{item.status}</div>
                                </div>
                                <div className={classes.box}>
                                    <NavLink className={classes.link} to={`/order/${item.id}`}>
                                        Перейти в заказ
                                    </NavLink>
                                    {readIds.includes(item.id) ? (
                                        <span className={classes.readMark}>Прочитано</span>
                                    ) : (
                                        <Button onClick={() => handleRead(item.id)}>Прочитать</Button>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className={classes.empty}>Нет уведомлений</div>
                        )
                    )}
                </div>
            </MainLayout>
        </>
    );
};

export default NotificationPage;
