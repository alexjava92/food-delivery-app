// pages/maintenance/MaintenancePage.tsx

import React from "react";
import classes from "./maintenancePage.module.scss";

const MaintenancePage = () => {
    return (
        <div className={classes.maintenance}>
            <h1>🛠 Технические работы</h1>
            <p>Приложение временно недоступно.<br />Пожалуйста, попробуйте позже.</p>
        </div>
    );
};

export default MaintenancePage;
