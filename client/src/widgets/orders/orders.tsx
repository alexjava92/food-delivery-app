import React, {FC, memo} from "react";
import classes from './orders.module.scss'
import {Order} from "../../entities/order/order";
import {useGetAllOrdersUserQuery} from "../../store/API/ordersApi";
import {useAppSelector} from "../../hooks/useRedux";
import {NavLink} from "react-router-dom";
import {Loader} from "../../shared/loader/loader";


interface IType {
    children?: React.ReactNode
}

export const Orders: FC<IType> = memo(({children}) => {
    const {user} = useAppSelector((state) => state.userReducer);
    const {data, error, isLoading} = useGetAllOrdersUserQuery(`${user?.id}`, {skip: !user?.id})

    return (
        <div className={classes.orders}>
            {isLoading && <Loader height={75}/>}
            {
                data?.length ? data?.map(item =>
                        <NavLink key={item.id} to={`/order/${item.id}`}>
                            <Order data={item}/>
                        </NavLink>
                    ) :
                    <div>Заказов не найдено</div>
            }
        </div>
    )
}) 
