import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const maintenanceApi = createApi({
    reducerPath: "maintenanceApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Maintenance"],
    endpoints: (build) => ({
        getMaintenance: build.query<{ maintenance: boolean }, void>({
            query: () => "settings/maintenance",
            providesTags: ["Maintenance"],
        }),
        setMaintenance: build.mutation<any, { maintenance: boolean }>({
            query: (body) => ({
                url: "settings/maintenance",
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
