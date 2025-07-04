import React, { useState, useEffect } from 'react';
import { useSetDeliverySettingsMutation, useGetDeliverySettingsQuery } from "../../store/API/settingsApi";
import classes from "./deliverySettingsPage.module.scss";

const DeliverySettingsPage = () => {
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [freeDeliveryFrom, setFreeDeliveryFrom] = useState(0);
    const [setDeliverySettings, { isLoading: isSaving }] = useSetDeliverySettingsMutation();
    const { data, isLoading } = useGetDeliverySettingsQuery();

    useEffect(() => {
        if (data) {
            setDeliveryPrice(data.deliveryPrice);
            setFreeDeliveryFrom(data.freeDeliveryFrom);
        }
    }, [data]);

    const handleSubmit = async () => {
        await setDeliverySettings({ deliveryPrice, freeDeliveryFrom });
        alert("Настройки сохранены");
    };

    return (
        <div className={classes.settingsPage}>
            <h2>Настройки доставки</h2>
            {isLoading ? (
                <p>Загрузка...</p>
            ) : (
                <div className={classes.form}>
                    <label>
                        Цена доставки (₽):
                        <input
                            type="number"
                            value={deliveryPrice}
                            onChange={(e) => setDeliveryPrice(Number(e.target.value))}
                        />
                    </label>

                    <label>
                        Бесплатная доставка от (₽):
                        <input
                            type="number"
                            value={freeDeliveryFrom}
                            onChange={(e) => setFreeDeliveryFrom(Number(e.target.value))}
                        />
                    </label>

                    <button onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? "Сохранение..." : "Сохранить изменения"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeliverySettingsPage;