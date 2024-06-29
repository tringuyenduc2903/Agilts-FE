import { providesList } from '@/lib/utils/providesList';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_COUNTRY as string,
  }),
  tagTypes: ['provinces', 'districts', 'wards'],
  endpoints: (builder) => {
    return {
      getProvinces: builder.query({
        query: () => ({
          url: `/1/0.htm`,
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'provinces'),
      }),
      getDistricts: builder.query({
        query: (provinceCode) => ({
          url: `/2/${provinceCode}.htm`,
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'districts'),
      }),
      getWards: builder.query({
        query: (districtCode) => ({
          url: `/3/${districtCode}.htm`,
          method: 'GET',
        }),
        providesTags: (result) => providesList(result, 'wards'),
      }),
    };
  },
});

export const { useGetProvincesQuery, useGetDistrictsQuery, useGetWardsQuery } =
  countryApi;
