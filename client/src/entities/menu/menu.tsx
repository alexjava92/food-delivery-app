import React, { FC, memo, useState } from "react";
import classes from "./menu.module.scss";
import { NavLink } from "react-router-dom";
import { HomeIcon } from "../../shared/images/icons/homeIcon";
import { MoreIcon } from "../../shared/images/icons/moreIcon";
import { NotificationIcon } from "../../shared/images/icons/notificationIcon";
import { CartIcon } from "../../shared/images/icons/cartIcon";
import { ProfileIcon } from "../../shared/images/icons/profileIcon";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { createPortal } from "react-dom";
import { Modal } from "../modal/modal";
import { useUpdateOrderNotificationMutation } from "../../store/API/ordersApi";
import { clearUnreadCount } from "../../store/slice/notificationSlice";

interface IType {
    children?: React.ReactNode;
}

const linkArr = [
    { to: "/", text: "Главная", icon: <HomeIcon /> },
    { to: "/profile", text: "Профиль", icon: <ProfileIcon /> },
    { to: "/cart", text: "Корзина", icon: <CartIcon /> },
    { to: "/notification", text: "Уведомления", icon: <NotificationIcon /> },
    { to: "/more", text: "Еще", icon: <MoreIcon /> },
];

export const Menu: FC<IType> = ({ children }) => {
    const { countProducts } = useAppSelector((state) => state.productReducer);
    const { unreadCount } = useAppSelector((state) => state.notificationReducer);
    const { user } = useAppSelector((state) => state.userReducer);
    const dispatch = useAppDispatch();
    const [updateOrderNotification] = useUpdateOrderNotificationMutation();
    const [modal, setModal] = useState(false);

    const handleNotificationClick = () => {
        if (unreadCount > 0 && user?.id) {
            updateOrderNotification({
                id: user.id,
                body: { notifications: false, userId: user.id },
            }).then(() => {
                dispatch(clearUnreadCount());
            });
        }
    };

    return (
        <nav className={classes.menu}>
            {linkArr.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        isActive ? `${classes.link} ${classes.active}` : classes.link
                    }
                    onClick={(e) => {
                        if (!countProducts && item.text === "Корзина") {
                            e.preventDefault();
                            setModal(true);
                        }
                        if (item.text === "Уведомления") {
                            handleNotificationClick();
                        }
                    }}
                >
                    {item.text === "Уведомления" && unreadCount > 0 && (
                        <span className={classes.label}>{unreadCount}</span>
                    )}
                    {item.text === "Корзина" && countProducts > 0 && (
                        <span className={classes.label}>{countProducts}</span>
                    )}
                    {item.icon}
                    <span className={classes.text}>{item.text}</span>
                </NavLink>
            ))}
            {modal &&
                createPortal(
                    <Modal
                        textModal={"Ваша корзина пустая"}
                        onClick={() => setModal(false)}
                        textBtn={"Закрыть"}
                    />,
                    document.body
                )}
        </nav>
    );
};