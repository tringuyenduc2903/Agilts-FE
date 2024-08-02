import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';
import { getLangRoute } from '../config/getLangRoute';

export const priceQuoteApi = createApi({
  reducerPath: 'priceQuoteApi',
  baseQuery: axiosBaseQuery({
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
