import { createApi } from '@reduxjs/toolkit/query/react';
import { getLangRoute } from '../config/getLangRoute';
import { axiosBaseQuery } from '../config/axios';
export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  }),
  endpoints: (builder) => {
    return {
      getStores: builder.query({
        query: (search) => ({
          url: `/api/branch${search ? `?${search}` : ''}`,
          method: 'GET',
        }),
      }),
      getFilter: builder.query({
        query: () => ({
          url: `/api${getLangRoute()}/filter-product`,
          method: 'GET',
        }),
      }),
      getProducts: builder.query({
        query: (search) => ({
          url: `/api${getLangRoute()}/product${
            search ? `?${search}&perPage=12` : '?perPage=12'
          }`,
          method: 'GET',
        }),
      }),
      getProductDetails: builder.query({
        query: (id) => ({
          url: `/api${getLangRoute()}/product/${id}`,
          method: 'GET',
        }),
      }),
      getProductReview: builder.query({
        query: ({ id, search }) => ({
          url: search
            ? `/api${getLangRoute()}/review/${id}?${search}`
            : `/api${getLangRoute()}/review/${id}`,
          method: 'GET',
        }),
      }),
      getFilterReview: builder.query({
        query: (id) => ({
          url: `/api${getLangRoute()}/filter-review/${id}`,
          method: 'GET',
        }),
      }),
      postReviewImage: builder.mutation({
        query: (body) => ({
          url: `/api${getLangRoute()}/review-image`,
          method: 'POST',
          data: body,
        }),
      }),
      postReviewUser: builder.mutation({
        query: (body) => ({
          url: `/api${getLangRoute()}/review-user`,
          method: 'POST',
          data: body,
        }),
      }),
    };
  },
});

export const {
  useGetStoresQuery,
  useGetFilterQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductReviewQuery,
  useGetFilterReviewQuery,
  usePostReviewImageMutation,
  usePostReviewUserMutation,
} = storesApi;
