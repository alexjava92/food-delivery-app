import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import {updateDeliverySettings} from "../../store/slice/settingsSlice";


const DeliverySettingsPage = () => {
    const dispatch = useAppDispatch();
    const [deliveryPrice, setDeliveryPrice] = useState(0);
    const [freeDeliveryFrom, setFreeDeliveryFrom] = useState(0);

    const handleSubmit = () => {
        dispatch(updateDeliverySettings({ deliveryPrice, freeDeliveryFrom }));
    };

    return (
        <div>
            <h2>Настройки доставки</h2>
            <label>
                Цена доставки:
                <input
                    type="number"
                    value={deliveryPrice}
                    onChange={(e) => setDeliveryPrice(Number(e.target.value))}
                />
            </label>
            <br />
            <label>
                Бесплатная доставка от:
                <input
                    type="number"
                    value={freeDeliveryFrom}
                    onChange={(e) => setFreeDeliveryFrom(Number(e.target.value))}
                />
            </label>
            <br />
            <button onClick={handleSubmit}>Сохранить изменения</button>
        </div>
    );
};

export default DeliverySettingsPage; 