import {
    fetchBaseQuery,
    FetchBaseQueryError,
    FetchArgs,
    BaseQueryFn,
} from '@reduxjs/toolkit/query/react';


const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}api/`,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("food-delivery-token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    // можно добавить обработку ошибок здесь
    return result;
};
