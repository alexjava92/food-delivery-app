import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {IOrder} from "../../types/types";
import {token} from "./apiToken";

export const ordersApi = createApi({
    reducerPath: "ordersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api/orders`,
    }),
    tagTypes: ['Orders'],
    endpoints: (build) => ({
        getOrders: build.query<{count:number, rows: IOrder[] }, number>({
            query: (page) => ({
                url: '',
                params:{
                    page
                }
            }),
            providesTags: ['Orders'],
        }),
        getAllOrdersUser: build.query<IOrder[], number | string>({
            query: (id) => ({
                url: `/user/${id}`,
            }),
            providesTags: ['Orders'],
        }),
        getOneOrder: build.query<IOrder, number | string>({
            query: (id) => ({
                url: `/${id}`,
            }),
            providesTags: ['Orders'],
        }),
        getStatistics: build.query({
            query: ({startTime, endTime, catId}) => ({
                url: `/statistics`,
                params: catId ? {startTime, endTime, catId: catId} : {startTime, endTime}
            }),
            providesTags: ['Orders'],
        }),
        createNewOrder: build.mutation({
            query: (body) => ({
                url: ``,
                method: 'Post',
                body
            }),
            invalidatesTags: ['Orders']
        }),
        updateOrderStatus: build.mutation({
            query: ({id, body}) => ({
                url: `${id}`,
                headers: {Authorization: `Bearer ${token}`},
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['Orders']
        }),
        updateOrderNotification: build.mutation({
            query: ({id, body}) => ({
                url: `user/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['Orders']
        }),

        // deleteOrder: build.mutation({
        //     query(id) {
        //         return {
        //             url: `${id}`,
        //             method: 'DELETE',
        //         }
        //     },
        //     invalidatesTags: ['Orders']
        // }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetAllOrdersUserQuery,
    useGetOneOrderQuery,
    useCreateNewOrderMutation,
    useUpdateOrderStatusMutation,
    useUpdateOrderNotificationMutation,
    useGetStatisticsQuery
} = ordersApi;
