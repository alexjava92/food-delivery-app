import React, {FC, memo, useEffect, useState} from "react";
import classes from "./menu.module.scss";
import {NavLink} from "react-router-dom";
import {HomeIcon} from "../../shared/images/icons/homeIcon";
import {MoreIcon} from "../../shared/images/icons/moreIcon";
import {NotificationIcon} from "../../shared/images/icons/notificationIcon";
import {CartIcon} from "../../shared/images/icons/cartIcon";
import {ProfileIcon} from "../../shared/images/icons/profileIcon";
import {useAppSelector} from "../../hooks/useRedux";
import {useGetAllOrdersUserQuery} from "../../store/API/ordersApi";
import {createPortal} from "react-dom";
import {Modal} from "../modal/modal";

interface IType {
    children?: React.ReactNode;
}

const linkArr = [
    {to: "/", text: "Главная", icon: <HomeIcon/>},
    {to: "/profile", text: "Профиль", icon: <ProfileIcon/>},
    {to: "/cart", text: "Корзина", icon: <CartIcon/>},
    {to: "/notification", text: "Уведомления", icon: <NotificationIcon/>},
    {to: "/more", text: "Еще", icon: <MoreIcon/>},
];
export const Menu: FC<IType> = memo(({children}) => {
    const {countProducts} = useAppSelector(state => state.productReducer)
    const {user} = useAppSelector((state) => state.userReducer);
    // const {data, error, isLoading} = useGetAllOrdersUserQuery(`${user?.id}`, {skip: !user?.id,pollingInterval: 1000,})
    const {data, error, isLoading} = useGetAllOrdersUserQuery(`${user?.id}`, {skip: !user?.id})
    const [newNotification, setNewNotification] = useState(0)
    const [modal, setModal] = useState(false)

    useEffect(() => {
        if (data) {
            data.map(item => {
                item?.notifications && setNewNotification(newNotification + 1)
            })
        }
    }, [data]);
    return (
        <nav className={classes.menu}>
            {linkArr.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({isActive}) =>
                        isActive ? `${classes.link} ${classes.active}` : classes.link
                    }
                    onClick={(e) => {
                        if (!countProducts && item.text === 'Корзина') {
                            e.preventDefault()
                            setModal(true)
                        }
                    }}
                >
                    {
                        (item.text === 'Уведомления' && newNotification) &&
                        <span className={classes.label}>{newNotification}</span>
                    }
                    {
                        item.text === 'Корзина' &&
                        <span className={classes.label}>{countProducts}</span>
                    }
                    {item.icon}
                    <span className={classes.text}>{item.text}</span>
                </NavLink>
            ))}
            {
                modal && createPortal(
                    <Modal textModal={'Ваша корзина пустая'} onClick={() => setModal(false)} textBtn={'Закрыть'}/>,
                    document.body
                )
            }
        </nav>
    );
});
