import { getLangRoute } from '@/config/axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const priceQuoteApi = createApi({
  reducerPath: 'priceQuoteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_PRICEQUOTE_URL}/api${getLangRoute()}`,
  }),
  endpoints: (builder) => {
    return {
      postPriceQuote: builder.mutation({
        query: (body) => ({
          url: `/price-quote`,
          method: 'POST',
          data: body,
        }),
      }),
    };
  },
});

export const { usePostPriceQuoteMutation } = priceQuoteApi;
