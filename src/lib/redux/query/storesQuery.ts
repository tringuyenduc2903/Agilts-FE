import { providesList } from '@/lib/utils/providesList';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  }),
  tagTypes: ['stores'],
  endpoints: (builder) => {
    return {
      getStores: builder.query({
        query: (search) => ({
          url: `/api/branch?${search}`,
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'stores'),
      }),
    };
  },
});

export const { useGetStoresQuery } = storesApi;
