import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_ADMIN_URL}/api`,
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
    };
  },
});

export const { usePostPriceQuoteMutation } = adminApi;
