import classes from './notificationPage.module.scss'
import {MainLayout} from "../../layout/mainLayout"
import {useAppSelector} from "../../hooks/useRedux";
import {useGetAllOrdersUserQuery, useUpdateOrderNotificationMutation,} from "../../store/API/ordersApi";
import React from "react";
import {Button} from "../../shared/button/button";
import {NavLink} from "react-router-dom";


const NotificationPage = () => {
    const {user} = useAppSelector((state) => state.userReducer);
    const {data, error, isLoading} = useGetAllOrdersUserQuery(`${user?.id}`, {skip: !user?.id})
    const [updateStatus] = useUpdateOrderNotificationMutation()
    // const [orderId, setOrderId] = useState(0)
    // useEffect(() => {
    //     if(data) setOrderIndex(data?.length - 1)
    // }, [data]);
    const handler = (orderId: number | string) => {
        data && updateStatus({
            id: orderId,
            body: {
                notifications: false
            }
        })
    }

    return (
        <MainLayout heading={'Уведомления'}>
            <div className={classes.list}>
                {
                    data?.length && data?.map(item =>
                        <>
                            {
                                item.notifications &&
                                <div className={classes.item}>
                                    <div className={classes.box}>
                                        <div className={classes.text}>Заказ №{item?.id}</div>
                                        <div className={classes.value}>{item?.status}</div>
                                    </div>
                                    <div className={classes.box}>
                                        <NavLink className={classes.link} to={`/order/${item?.id}`}>
                                            Перейти в заказ
                                        </NavLink>
                                        <Button onClick={() => handler(item?.id)}>Прочитать</Button>
                                    </div>
                                </div>
                            }
                        </>
                    )
                }
            </div>
        </MainLayout>
    );
};
export default NotificationPage;
