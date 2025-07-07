// src/components/MaintenanceGuard.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "./hooks/useRedux";
import { useGetMaintenanceQuery } from "./store/API/maintenanceApi";
import { MaintenancePage } from "./pages/maintenance/MaintenanceLazy";
import {BlockedPage} from "./pages/blockedPage/blockedPageLazy";


interface Props {
    children: React.ReactNode;
}

const MaintenanceGuard: React.FC<Props> = ({ children }) => {
    const { user } = useAppSelector((state) => state.userReducer);
    const location = useLocation();
    const isAdmin =
        user?.role === "admin" ||
        user?.role === "superAdmin" ||
        user?.role === "cashier" ||
        user?.role === "cook";
    const onMaintenancePage = location.pathname === "/maintenance";

    const { data, isLoading } = useGetMaintenanceQuery(undefined, {
        skip: isAdmin || onMaintenancePage,
        refetchOnMountOrArgChange: false,
    });

    if (isLoading) return null;

    // 🛑 Заблокирован
    if (user?.role === "block") {
        return <BlockedPage />;
    }

    // 🛠 Тех. Работы
    if (data?.maintenance && !isAdmin && !onMaintenancePage) {
        return <MaintenancePage />;
    }

    return <>{children}</>;
};

export default React.memo(MaintenanceGuard);
