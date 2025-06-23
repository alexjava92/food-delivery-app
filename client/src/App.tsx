import React, { useEffect, useState } from "react";
import "./reset.scss";
import "./global.scss";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import { useTelegram } from "./hooks/useTelegram";
import { useAppDispatch, useAppSelector } from "./hooks/useRedux";
import { fetchUser } from "./store/slice/userSlice";
import { adminRoutes, cashierRoutes, cookRoutes, routes, superAdminRoutes } from "./routes/routes";
import { useAuthUserMutation } from "./store/API/userApi";
import { QrcodePage } from "./pages/qrcode/qrcodePageLazy";
import { useGetAllOrdersUserQuery } from "./store/API/ordersApi";
import { setUnreadCount } from "./store/slice/notificationSlice"; // Импортируйте setUnreadCount
import { useGetMaintenanceQuery } from "./store/API/maintenanceApi";
import ErrorBoundary from "./ErrorBoundary";
import {MaintenancePage} from "./pages/maintenance/MaintenanceLazy";

interface IRoutes {
    path: string;
    element: React.ReactNode;
}

function App() {
    const { tg } = useTelegram();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.userReducer);
    const [allRoutes, setAllRoutes] = useState<IRoutes[]>();
    const [isPlug, setIsPlug] = useState(true);
    const [authUser, { data, error }] = useAuthUserMutation();
    const { data: userOrders } = useGetAllOrdersUserQuery(`${user?.id}`, {
        skip: !user?.id,
        pollingInterval: 5000, // Каждые 5 секунд
    });

    const navigate = useNavigate();


    useEffect(() => {
        const isDev = !tg?.initDataUnsafe?.user?.id;

        if (isDev && process.env.NODE_ENV === "development") {
            authUser({
                chatId: 123456789,
                username: "dev_user",
                queryId: "fake_query",
            });
            setIsPlug(false);
            return;
        }

        if (tg?.initDataUnsafe?.user?.id) {
            authUser({
                chatId: tg?.initDataUnsafe?.user?.id,
                username: tg?.initDataUnsafe?.user?.username,
                queryId: tg?.initDataUnsafe?.query_id ? tg?.initDataUnsafe?.query_id : "queryId",
            });
            setIsPlug(false);
            return;
        } else {
            navigate(`/qrcode`);
        }
    }, []);

    useEffect(() => {
        if (data) {
            dispatch(fetchUser(data?.existUser));
            localStorage.setItem("food-delivery-token", data?.access_token);
        }
    }, [data]);

    useEffect(() => {
        if (userOrders) {
            console.log("User orders updated:", userOrders);
            const count = userOrders.filter(item => item.notifications).length;
            console.log("Setting unreadCount:", count);
            dispatch(setUnreadCount(count));
        }
    }, [userOrders, dispatch]);

    useEffect(() => {
        if (user?.role === "superAdmin") {
            setAllRoutes([...routes, ...adminRoutes, ...superAdminRoutes]);
        } else if (user?.role === "admin") {
            setAllRoutes([...routes, ...adminRoutes]);
        } else if (user?.role === "cook") {
            setAllRoutes([...routes, ...cookRoutes]);
        } else if (user?.role === "cashier") {
            setAllRoutes([...routes, ...cashierRoutes]);
        } else {
            setAllRoutes([...routes]);
        }
    }, [user]);



    return (
        <Routes>
            <Route path="/maintenance" element={<MaintenancePage />} />

            {isPlug ? (
                <Route path={`/qrcode`} element={<QrcodePage />} />
            ) : (
                allRoutes?.map((route) => (
                    <Route key={route?.path} path={route?.path} element={route?.element} />
                ))
            )}
        </Routes>
    );

}

export default App;