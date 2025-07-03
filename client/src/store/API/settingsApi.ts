import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface IDeliverySettings {
    deliveryPrice: number;
    freeDeliveryFrom: number;
}

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getDeliverySettings: build.query<IDeliverySettings, void>({
            query: () => "settings/delivery",
        }),
    }),
});

export const { useGetDeliverySettingsQuery } = settingsApi;
