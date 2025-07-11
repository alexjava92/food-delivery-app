import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrder } from "../../types/types";
import { token } from "./apiToken";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api/orders`,
    }),
    tagTypes: ["Orders"],
    endpoints: (build) => ({

        // Заказы с пагинацией
        getOrders: build.query<{ count: number; rows: IOrder[] }, number>({
            query: (page) => ({
                url: '',
                params: { page },
            }),
            providesTags: (result) =>
                result?.rows
                    ? [
                        ...result.rows.map((order) => ({ type: "Orders" as const, id: order.id })),
                        { type: "Orders", id: "LIST" },
                    ]
                    : [{ type: "Orders", id: "LIST" }],
        }),

        // Заказы пользователя (для уведомлений)
        getAllOrdersUser: build.query<IOrder[], number | string>({
            query: (id) => ({
                url: `/user/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "Orders", id }],
        }),

        // Один заказ
        getOneOrder: build.query<IOrder, number | string>({
            query: (id) => ({
                url: `/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "Orders", id }],
        }),

        // Статистика
        getStatistics: build.query({
            query: ({ startTime, endTime, catId }) => ({
                url: `/statistics`,
                params: catId
                    ? { startTime, endTime, catId }
                    : { startTime, endTime },
            }),
        }),

        // Создание нового заказа
        createNewOrder: build.mutation({
            query: (body) => ({
                url: ``,
                method: "POST",
                body,
                headers: { Authorization: `Bearer ${token}` },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Orders", id: "LIST" },
                { type: "Orders", id: arg.userId },
            ]
        }),

        // Обновление статуса заказа
        updateOrderStatus: build.mutation<any, { id: string | number; body: any }>({
            query: ({ id, body }) => ({
                url: `${id}`,
                method: "PATCH",
                body,
                headers: { Authorization: `Bearer ${token}` },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Orders", id: "USER_ORDERS" }],
        }),

        // Обновление уведомления
        updateOrderNotification: build.mutation({
            query: ({ id, body }) => ({
                url: `user/${id}`,
                method: "PATCH",
                body,
                headers: { Authorization: `Bearer ${token}` },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Orders", id: "USER_ORDERS" }],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetAllOrdersUserQuery,
    useGetOneOrderQuery,
    useCreateNewOrderMutation,
    useUpdateOrderStatusMutation,
    useUpdateOrderNotificationMutation,
    useGetStatisticsQuery,
} = ordersApi;
