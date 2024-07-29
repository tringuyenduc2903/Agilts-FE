import { createApi } from '@reduxjs/toolkit/query/react';
import { getLangRoute } from '../config/getLangRoute';
import { axiosBaseQuery } from '../config/axios';
export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${getLangRoute()}`,
  }),
  tagTypes: ['reviews', 'wishlist'],
  endpoints: (builder) => {
    return {
      getStores: builder.query({
        query: (search) => ({
          url: `/branch${search ? `?${search}` : ''}`,
          method: 'GET',
        }),
      }),
      getFilter: builder.query({
        query: () => ({
          url: `/filter-product`,
          method: 'GET',
        }),
      }),
      getProducts: builder.query({
        query: (search) => ({
          url: `/product${search ? `?${search}&perPage=12` : '?perPage=12'}`,
          method: 'GET',
        }),
      }),
      getProductDetails: builder.query({
        query: (id) => ({
          url: `/product/${id}`,
          method: 'GET',
        }),
      }),
      getProductReview: builder.query({
        query: ({ id, search }) => ({
          url: search ? `/review/${id}?${search}` : `/review/${id}`,
          method: 'GET',
        }),
        providesTags: ['reviews'],
      }),
      getFilterReview: builder.query({
        query: (id) => ({
          url: `/filter-review/${id}`,
          method: 'GET',
        }),
        providesTags: ['reviews'],
      }),
      postReviewImage: builder.mutation({
        query: (body) => ({
          url: `/review-image`,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          method: 'POST',
          data: body,
        }),
      }),
      postReviewUser: builder.mutation({
        query: (body) => ({
          url: `/review-user`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['reviews'],
      }),
      getWishlist: builder.query({
        query: () => ({
          url: `/wishlist`,
          method: 'GET',
        }),
        providesTags: ['wishlist'],
      }),
      postWishlist: builder.mutation({
        query: (body) => ({
          url: `/wishlist`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['wishlist'],
      }),
      deleteWishlist: builder.mutation({
        query: (id) => ({
          url: `/wishlist/${id}`,
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
