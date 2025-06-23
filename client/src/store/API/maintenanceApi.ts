import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { token } from "./apiToken";

export const maintenanceApi = createApi({
    reducerPath: "maintenanceApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api/settings`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("food-delivery-token"); // ✅ всегда актуальный токен
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Maintenance"],
    endpoints: (build) => ({
        getMaintenance: build.query<{ maintenance: boolean }, void>({
            query: () => "/maintenance",
            providesTags: ["Maintenance"],
        }),
        setMaintenance: build.mutation<any, { maintenance: boolean }>({
            query: (body) => ({
                url: "/maintenance",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Maintenance"],
        }),
    }),
});

export const {
    useGetMaintenanceQuery,
    useSetMaintenanceMutation,
} = maintenanceApi;
