import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const contactsApi = createApi({
    reducerPath: "contactsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}api`,
    }),
    endpoints: (build) => ({
        getContacts: build.query({
            query: (id) => ({
                url: `/contacts`,
            }),
        }),
    }),
});

export const {useGetContactsQuery} = contactsApi;
