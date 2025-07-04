import React, { useState, useEffect } from 'react';
import { useSetDeliverySettingsMutation, useGetDeliverySettingsQuery } from "../../store/API/settingsApi";
import classes from "./deliverySettingsPage.module.scss";
import { MainLayout } from "../../layout/mainLayout";
import { Loader } from "../../shared/loader/loader";
import { SimpleTextField } from "../../shared/simpleTextField/simpleTextField";
import { Button } from "../../shared/button/button";
import { Modal } from "../../entities/modal/modal";

const DeliverySettingsPage = () => {
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [freeDeliveryFrom, setFreeDeliveryFrom] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [setDeliverySettings, { isLoading: isSaving }] = useSetDeliverySettingsMutation();
    const { data, isLoading } = useGetDeliverySettingsQuery();

    useEffect(() => {
        if (data) {
            setDeliveryPrice(data.deliveryPrice);
            setFreeDeliveryFrom(data.freeDeliveryFrom);
        }
    }, [data]);

    const handleSubmit = async () => {
        if (deliveryPrice < 0 || freeDeliveryFrom < 0) {
            setError("Значения не могут быть отрицательными");
            return;
        }
        if (deliveryPrice > freeDeliveryFrom) {
            setError("Цена доставки не должна превышать порог бесплатной доставки");
            return;
        }
        setError(null);
        await setDeliverySettings({ deliveryPrice, freeDeliveryFrom });
        setShowModal(true);
    };

    return (
        <MainLayout heading="Настройки доставки" textCenter>
            <div className={classes.settingsPage}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className={classes.form}>
                        <SimpleTextField
                            label="Цена доставки (₽)"
                            type="number"
                            value={deliveryPrice.toString()}
                            onChange={(e) => setDeliveryPrice(Number(e.target.value))}
                        />

                        <SimpleTextField
                            label="Бесплатная доставка от (₽)"
                            type="number"
                            value={freeDeliveryFrom.toString()}
                            onChange={(e) => setFreeDeliveryFrom(Number(e.target.value))}
                        />

                        {error && <p className="error">{error}</p>}

                        <Button onClick={handleSubmit} disabled={isSaving}>
                            {isSaving ? "Сохранение..." : "Сохранить изменения"}
                        </Button>
                    </div>
                )}
                {showModal && (
                    <Modal
                        textModal="Настройки успешно сохранены"
                        textBtn="Закрыть"
                        onClick={() => setShowModal(false)}
                    />
                )}
            </div>
        </MainLayout>
    );
};

export default DeliverySettingsPage;
