import React, { useEffect, useState } from "react";
import { MainLayout } from "../../layout/mainLayout";
import classes from "./maintenancePage.module.scss";
import { Switch } from "../../shared/switch/Switch";
import {
    useGetMaintenanceQuery,
    useSetMaintenanceMutation,
} from "../../store/API/maintenanceApi";


const MaintenanceTogglePage = () => {
    const { data, isLoading } = useGetMaintenanceQuery();
    const [setMaintenance, { isLoading: isMutating }] = useSetMaintenanceMutation();
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (data) {
            setEnabled(data.maintenance);
        }
    }, [data]);

    const toggleHandler = () => {
        const newValue = !enabled;
        setEnabled(newValue);
        setMaintenance({ maintenance: newValue });
    };

    return (
        <MainLayout heading="Технические работы">
            <div className={classes.wrapper}>
                <h2>Режим технических работ</h2>
                <div className={classes.control}>
                    <span>{enabled ? "Включено" : "Выключено"}</span>
                    <Switch checked={enabled} onChange={toggleHandler} disabled={isMutating || isLoading} />
                </div>
                <p className={classes.note}>
                    При включении режима пользователи не смогут использовать приложение, кроме админов.
                </p>
                {/*<Button size="small" onClick={toggleHandler} disabled={isMutating || isLoading}>
                    {enabled ? "Выключить" : "Включить"}
                </Button>*/}
            </div>
        </MainLayout>
    );
};

export default MaintenanceTogglePage;
