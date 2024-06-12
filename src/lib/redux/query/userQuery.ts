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
          url: `/api/user`,
          method: 'GET',
        }),
        providesTags: ['users'],
      }),
      login: builder.mutation({
        query: (body) => ({
          url: `/login`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['users'],
      }),
      confirmPassword: builder.mutation({
        query: (password) => ({
          url: '/user/confirm-password',
          method: 'POST',
          data: {
            password: password,
          },
        }),
      }),
      confirmPasswordStatus: builder.query({
        query: () => ({
          url: '/user/confirmed-password-status',
        }),
      }),
      twoFactorQrCode: builder.query({
        query: () => ({
          url: '/user/two-factor-qr-code',
        }),
      }),
      register: builder.mutation({
        query: (body) => ({
          url: `/register`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['users'],
      }),
      logout: builder.mutation({
        query: () => ({
          url: '/logout',
          method: 'POST',
        }),
        invalidatesTags: ['users'],
      }),
      forgotPassword: builder.mutation({
        query: (email) => ({
          url: '/forgot-password',
          method: 'POST',
          data: {
            email: email,
          },
        }),
      }),
      resetPassword: builder.mutation({
        query: (body) => ({
          url: '/reset-password',
          method: 'POST',
          data: body,
        }),
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useLoginMutation,
  useConfirmPasswordMutation,
  useConfirmPasswordStatusQuery,
  useTwoFactorQrCodeQuery,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = userApi;
