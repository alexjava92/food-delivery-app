import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrder } from "../../types/types";
import { token } from "./apiToken";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api/orders`,
    }),
    tagTypes: ['Orders'], // используем с id для getAllOrdersUser
    endpoints: (build) => ({

        // Заказы (пагинация) — НЕ используем providesTags
        getOrders: build.query<{ count: number; rows: IOrder[] }, number>({
            query: (page) => ({
                url: '',
                params: {
                    page,
                },
            }),
        }),

        // Заказы текущего пользователя (основа для уведомлений)
        getAllOrdersUser: build.query<IOrder[], number | string>({
            query: (id) => ({
                url: `/user/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),

        // Один заказ (если нужен — не инвалидируем через него)
        getOneOrder: build.query<IOrder, number | string>({
            query: (id) => ({
                url: `/${id}`,
            }),
        }),

        // Статистика (не участвует в тегах)
        getStatistics: build.query({
            query: ({ startTime, endTime, catId }) => ({
                url: `/statistics`,
                params: catId
                    ? { startTime, endTime, catId }
                    : { startTime, endTime },
            }),
        }),

        // Создание нового заказа (можно оставить общий invalidate)
        createNewOrder: build.mutation({
            query: (body) => ({
                url: ``,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Orders'], // можно удалить, если не используешь в списке
        }),

        updateOrderStatus: build.mutation<any, { id: string | number; body: any }>({
            query: ({ id, body }) => ({
                url: `${id}`,
                method: 'PATCH',
                body,
                headers: { Authorization: `Bearer ${token}` },
            }),
            invalidatesTags: (result, error, { body }) => [
                { type: 'Orders', id: body.userId },
            ],
        }),

        // ✅ Прочитано уведомление
        updateOrderNotification: build.mutation({
            query: ({ id, body }) => ({
                url: `user/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Orders', id },
            ],
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
