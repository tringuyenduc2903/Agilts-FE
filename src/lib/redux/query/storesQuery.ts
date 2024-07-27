import { createApi } from '@reduxjs/toolkit/query/react';
import { getLangRoute } from '../config/getLangRoute';
import { axiosBaseQuery } from '../config/axios';
export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  }),
  tagTypes: ['reviews', 'wishlist'],
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
        providesTags: ['reviews'],
      }),
      getFilterReview: builder.query({
        query: (id) => ({
          url: `/api${getLangRoute()}/filter-review/${id}`,
          method: 'GET',
        }),
        providesTags: ['reviews'],
      }),
      postReviewImage: builder.mutation({
        query: (body) => ({
          url: `/api${getLangRoute()}/review-image`,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
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
        invalidatesTags: ['reviews'],
      }),
      getWishlist: builder.query({
        query: () => ({
          url: `/api${getLangRoute()}/wishlist`,
          method: 'GET',
        }),
        providesTags: ['wishlist'],
      }),
      postWishlist: builder.mutation({
        query: (body) => ({
          url: `/api${getLangRoute()}/wishlist`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['wishlist'],
      }),
      deleteWishlist: builder.mutation({
        query: (id) => ({
          url: `/api${getLangRoute()}/wishlist/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['wishlist'],
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
  useGetWishlistQuery,
  usePostWishlistMutation,
  useDeleteWishlistMutation,
} = storesApi;
