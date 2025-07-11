import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface IDeliverySettings {
    deliveryPrice: number;
    freeDeliveryFrom: number;
}

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ['DeliverySettings'],
    endpoints: (build) => ({
        getDeliverySettings: build.query<IDeliverySettings, void>({
            query: () => "settings/delivery",
            providesTags: ['DeliverySettings'], // <--- добавлено
        }),
        setDeliverySettings: build.mutation<any, IDeliverySettings>({
            query: (body) => ({
                url: "settings/delivery",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ['DeliverySettings'],
        }),
    }),
});


export const {
    useGetDeliverySettingsQuery,
    useSetDeliverySettingsMutation,
} = settingsApi;
