import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { IProduct} from "../../types/types";

export const searchApi = createApi({
    reducerPath: "searchApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api/`,
    }),
    endpoints: (build) => ({
        search: build.query<IProduct[], string>({
            query: (query) => ({
                url: `${query}`,
            }),
        }),
    }),
});

export const {useSearchQuery} = searchApi;
