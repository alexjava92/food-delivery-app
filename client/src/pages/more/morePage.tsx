import classes from "./morePage.module.scss";
import {NavLink} from "react-router-dom";
import {MainLayout} from "../../layout/mainLayout";
import {FavoritesIcon} from "../../shared/images/icons/favoritesIcon";
import {useAppSelector} from "../../hooks/useRedux";
import {OrdersIcon} from "../../shared/images/icons/ordersIcon";
import {ProfileIcon} from "../../shared/images/icons/profileIcon";
import {SettingsIcon} from "../../shared/images/icons/settingsIcon";
import {StatisticsIcon} from "../../shared/images/icons/statisticsIcon";
import {MapPin} from "lucide-react";

const linkArr = [
    {to: "orders", text: "Заказы", icon: <OrdersIcon/>},
    {to: "/profile", text: "Профиль", icon: <ProfileIcon isSimple/>},
    {to: "/more/favorites", text: "Избранное ", icon: <FavoritesIcon/>},
    {to: "/contacts", text: "Контакты ", icon: <MapPin size={20}/>},
];
const linkArrAdmin = [
    {to: "/more/all-orders", text: "Все заказы", icon: <OrdersIcon/>},,
    {to: "/more/statistics", text: "Статистика", icon: <StatisticsIcon isSimple/>},
    {to: "/more/settings", text: "Настойка товаров", icon: <SettingsIcon/>},
    {to: "/more/change-status-order", text: "Изменение статуса заказа", icon: <OrdersIcon/>},
    {to: "/more/add-admin", text: "Изменение роли пользователя", icon: <SettingsIcon/>},
    {to: "/more/more-settings-app", text: "Настройка приложения", icon: <SettingsIcon/>},
];
const linkArrCook = [
    {to: "/more/all-orders", text: "Все заказы", icon: <OrdersIcon/>},
    {to: "/more/settings", text: "Настойка товаров", icon: <SettingsIcon/>},
    {to: "/more/change-status-order", text: "Изменение статуса заказа", icon: <OrdersIcon/>},
];
const linkArrCashier = [
    {to: "/more/all-orders", text: "Все заказы", icon: <OrdersIcon/>},
    {to: "/more/change-status-order", text: "Изменение статуса заказа", icon: <OrdersIcon/>},
];
const MorePage = () => {
    const {user} = useAppSelector((state) => state.userReducer);

    return (
        <MainLayout heading={"Еще"} textCenter>
            <nav className={classes.menu}>
                {
                    linkArr?.map(item => (
                        <NavLink key={item.to} to={item.to} className={classes.link}>
                            {item.icon}
                            <span>{item.text}</span>
                        </NavLink>
                    ))
                }
                {
                    user?.role === 'cashier' && linkArrCashier?.map(item => (
                        <NavLink key={item.to} to={item.to} className={classes.link}>
                            {item.icon}
                            <span>{item.text}</span>
                        </NavLink>
                    ))
                }
                {
                    user?.role === 'cook' && linkArrCook?.map(item => (
                        <NavLink key={item.to} to={item.to} className={classes.link}>
                            {item.icon}
                            <span>{item.text}</span>
                        </NavLink>
                    ))
                }
                {
                    (user?.role === 'admin' || user?.role === 'superAdmin') && linkArrAdmin?.map(item => (
                        <NavLink key={item?.to} to={item?.to ?? '/'} className={classes.link}>
                            {item?.icon}
                            <span>{item?.text}</span>
                        </NavLink>
                    ))
                }
            </nav>
        </MainLayout>
    );
};
export default MorePage;
