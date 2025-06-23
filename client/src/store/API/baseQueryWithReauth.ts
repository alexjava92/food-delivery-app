import { BaseQueryApi, FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {token} from "./apiToken";

export const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    const rawBaseQuery = fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api/`,
        prepareHeaders: (headers) => {
            headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    });

    const result = await rawBaseQuery(args, api, extraOptions);

    // 👉 Перехват 503 и редирект на maintenance
    if (result.error?.status === 503) {
        window.location.href = "/maintenance";
        return;
    }

    return result;
};
