import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    deliveryPrice: number;
    freeDeliveryFrom: number;
}

const initialState: SettingsState = {
    deliveryPrice: 0,
    freeDeliveryFrom: 0,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateDeliverySettings(state, action: PayloadAction<{ deliveryPrice: number; freeDeliveryFrom: number }>) {
            state.deliveryPrice = action.payload.deliveryPrice;
            state.freeDeliveryFrom = action.payload.freeDeliveryFrom;
        },
    },
});

export const { updateDeliverySettings } = settingsSlice.actions;
export default settingsSlice.reducer; 