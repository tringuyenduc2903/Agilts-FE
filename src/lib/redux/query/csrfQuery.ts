import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';

export const csrfApi = createApi({
  reducerPath: 'csrfApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  }),
  endpoints: (builder) => {
    return {
      getCSRFCookie: builder.mutation({
        query: () => ({
          url: `/sanctum/csrf-cookie`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const { useGetCSRFCookieMutation } = csrfApi;
