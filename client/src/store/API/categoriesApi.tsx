import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ICategory} from "../../types/types";
import {token} from "./apiToken";

export const categoriesApi = createApi({
    reducerPath: "categoriesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api/categories/`,
        prepareHeaders: (headers, {getState}) => {
            headers.set("Authorization", `Bearer ${token}`)
        },
    }),
    tagTypes: ['Category'],
    endpoints: (build) => ({
        getCategories: build.query<ICategory[], string>({
            query: () => ({
                url: '',
            }),
            providesTags: ['Category'],
        }),
        getCategory: build.query<ICategory, string>({
            query: (id) => ({
                url: id,
            }),
            providesTags: ['Category'],
        }),
        createNewCategory: build.mutation({
            query: (body) => ({
                url: ``,
                method: 'Post',
                body
            }),
            invalidatesTags: ['Category']
        }),
        updateCategory: build.mutation({
            query: ({id, body}) => ({
                url: `${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['Category']
        }),
        deleteCategory: build.mutation({
            query(id) {
                return {
                    url: `${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: ['Category']
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateNewCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;
