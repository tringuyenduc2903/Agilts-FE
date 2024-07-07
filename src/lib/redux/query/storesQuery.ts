import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getLangRoute } from '../config/getLangRoute';
export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  }),
  tagTypes: ['stores', 'filter', 'products'],
  endpoints: (builder) => {
    return {
      getStores: builder.query({
        query: (search) => ({
          url: `/api/branch${search ? `?${search}` : ''}`,
          method: 'GET',
        }),
        providesTags: ['stores'],
      }),
      getFilter: builder.query({
        query: () => ({
          url: `/api${getLangRoute()}/filter`,
          method: 'GET',
        }),
        providesTags: ['filter'],
      }),
      getProducts: builder.query({
        query: (search) => ({
          url: `/api${getLangRoute()}/product${search ? `?${search}` : ''}`,
          method: 'GET',
        }),
        providesTags: ['products'],
      }),
      getProductDetails: builder.query({
        query: (id) => ({
          url: `/api${getLangRoute()}/product/${id}`,
          method: 'GET',
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
} = storesApi;
