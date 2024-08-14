import { getLangRoute } from '@/config/axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      process.env.NEXT_PUBLIC_BACKEND_ADMIN_URL
    }/api${getLangRoute()}`,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  endpoints: (builder) => {
    return {
      postPriceQuote: builder.mutation({
        query: (body) => ({
          url: `/price-quote`,
          method: 'POST',
          body: body,
        }),
      }),
      getSettings: builder.query({
        query: (setting_type) => ({
          url: `/setting/${setting_type}`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const { usePostPriceQuoteMutation, useGetSettingsQuery } = adminApi;
