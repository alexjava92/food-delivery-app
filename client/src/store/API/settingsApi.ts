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
        setDeliverySettings: build.mutation<any, IDeliverySettings>({
            query: (body) => ({
                url: "settings/delivery",
                method: "PATCH",
                body,
            }),
        }),
    }),
});

export const {
    useGetDeliverySettingsQuery,
    useSetDeliverySettingsMutation,
} = settingsApi;
