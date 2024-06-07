import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  }),
  endpoints: (builder) => {
    return {
      register: builder.mutation({
        query: (body) => {
          console.log(body);
          return {
            url: `/register`,
            method: 'POST',
            data: body,
          };
        },
      }),
    };
  },
});

export const { useRegisterMutation } = userApi;
