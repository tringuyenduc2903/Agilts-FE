import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  }),
  tagTypes: ['users'],
  endpoints: (builder) => {
    return {
      getUser: builder.query({
        query: () => ({
          url: `/user`,
          method: 'GET',
        }),
        providesTags: ['users'],
      }),
      register: builder.mutation({
        query: (body) => ({
          url: `/register`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['users'],
      }),
    };
  },
});

export const { useGetUserQuery, useRegisterMutation } = userApi;
