import { getLangRoute } from '@/config/axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: fetchBaseQuery({
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
    };
  },
});

export const { useGetStoresQuery } = storesApi;
