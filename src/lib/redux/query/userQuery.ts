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
      changePassword: builder.mutation({
        query: (body) => ({
          url: '/user/password',
          method: 'PUT',
          data: body,
        }),
      }),
      turnOn2FA: builder.mutation({
        query: () => ({
          url: '/user/two-factor-authentication',
          method: 'POST',
          body: {
            force: true,
          },
        }),
      }),
      twoFactorQrCode: builder.query({
        query: () => ({
          url: '/user/two-factor-qr-code',
        }),
      }),
      twoFactorSecretKey: builder.query({
        query: () => ({
          url: '/user/two-factor-secret-key',
        }),
      }),
      confirm2FA: builder.mutation({
        query: (code) => ({
          url: '/user/confirmed-two-factor-authentication',
          method: 'POST',
          data: {
            code: code,
          },
        }),
        invalidatesTags: ['users'],
      }),
      getRecoveryCodes: builder.query({
        query: () => ({
          url: '/user/two-factor-recovery-codes',
        }),
      }),
      postRecoveryCodes: builder.mutation({
        query: () => ({
          url: '/user/two-factor-recovery-codes',
          method: 'POST',
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
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useTurnOn2FAMutation,
  useTwoFactorQrCodeQuery,
  useTwoFactorSecretKeyQuery,
  useConfirm2FAMutation,
  useGetRecoveryCodesQuery,
  usePostRecoveryCodesMutation,
} = userApi;
