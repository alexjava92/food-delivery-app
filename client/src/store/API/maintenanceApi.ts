import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}api/settings`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("food-delivery-token"); // обязательно из localStorage
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

// 🔥 Обертка для ловли 503 и редиректа
const baseQueryWithMaintenanceCheck: typeof rawBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 503) {
        window.location.href = "/maintenance"; // редирект
    }

    return result;
};

export const maintenanceApi = createApi({
    reducerPath: "maintenanceApi",
    baseQuery: baseQueryWithMaintenanceCheck,
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
