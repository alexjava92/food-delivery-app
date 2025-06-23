import React, { useEffect, useState } from "react";
import { MainLayout } from "../../layout/mainLayout";
 // Можно использовать любой toggle компонент
import { Button } from "../../shared/button/button";
import classes from "./maintenancePage.module.scss";
import { Switch } from "../../shared/switch/Switch";

// Предположим, что ты будешь получать и сохранять флаг через API
// Пока без API, локально:

const MaintenanceTogglePage = () => {
    const [enabled, setEnabled] = useState(false); // текущее значение

    const toggleHandler = () => {
        setEnabled(!enabled);
        // В будущем: отправка на сервер
        // await api.patch('/admin/settings', { maintenance: !enabled })
    };

    return (
        <MainLayout heading="Технические работы">
            <div className={classes.wrapper}>
                <h2>Режим технических работ</h2>
                <div className={classes.control}>
                    <span>{enabled ? "Включено" : "Выключено"}</span>
                    <Switch checked={enabled} onChange={toggleHandler} />
                </div>
                <p className={classes.note}>
                    При включении режима пользователи не смогут использовать приложение, кроме админов.
                </p>
                <Button size="small" onClick={toggleHandler}>
                    {enabled ? "Выключить" : "Включить"}
                </Button>
            </div>
        </MainLayout>
    );
};

export default MaintenanceTogglePage;
