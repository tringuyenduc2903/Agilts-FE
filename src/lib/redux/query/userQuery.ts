import { getCookies } from 'cookies-next';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';
const curLang = getCookies()?.NEXT_LOCALE || 'vi';
const langRoute = curLang === 'en' ? '/en' : '';

console.log(curLang);
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL as string}`,
  }),
  tagTypes: ['users', 'recover_codes'],
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
          url: `${langRoute}/login`,
          method: 'POST',
          data: body,
        }),
      }),
      register: builder.mutation({
        query: (body) => ({
          url: `${langRoute}/register`,
          method: 'POST',
          data: body,
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          url: `${langRoute}/logout`,
          method: 'POST',
        }),
        invalidatesTags: ['users'],
      }),
      updateUser: builder.mutation({
        query: (body) => ({
          url: `${langRoute}/user/profile-information`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['users'],
      }),
      confirmPassword: builder.mutation({
        query: (password) => ({
          url: `${langRoute}/user/confirm-password`,
          method: 'POST',
          data: {
            password: password,
          },
        }),
      }),
      confirmPasswordStatus: builder.query({
        query: () => ({
          url: `${langRoute}/user/confirmed-password-status`,
        }),
      }),
      forgotPassword: builder.mutation({
        query: (email) => ({
          url: `${langRoute}/forgot-password`,
          method: 'POST',
          data: {
            email: email,
          },
        }),
      }),
      resetPassword: builder.mutation({
        query: (body) => ({
          url: `${langRoute}/reset-password`,
          method: 'POST',
          data: body,
        }),
      }),
      changePassword: builder.mutation({
        query: (body) => ({
          url: `${langRoute}/user/password`,
          method: 'PUT',
          data: body,
        }),
      }),
      turnOn2FA: builder.mutation({
        query: () => ({
          url: `${langRoute}/user/two-factor-authentication`,
          method: 'POST',
          body: {
            force: true,
          },
        }),
      }),
      twoFactorQrCode: builder.query({
        query: () => ({
          url: `${langRoute}/user/two-factor-qr-code`,
        }),
      }),
      twoFactorSecretKey: builder.query({
        query: () => ({
          url: `${langRoute}/user/two-factor-secret-key`,
        }),
      }),
      confirm2FA: builder.mutation({
        query: (code) => ({
          url: `${langRoute}/user/confirmed-two-factor-authentication`,
          method: 'POST',
          data: {
            code: code,
          },
        }),
        invalidatesTags: ['users'],
      }),
      getRecoveryCodes: builder.query({
        query: () => ({
          url: `${langRoute}/user/two-factor-recovery-codes`,
        }),
        providesTags: ['recover_codes'],
      }),
      postRecoveryCodes: builder.mutation({
        query: () => ({
          url: `${langRoute}/user/two-factor-recovery-codes`,
          method: 'POST',
        }),
        invalidatesTags: ['recover_codes'],
      }),
      verifyTwoFactor: builder.mutation({
        query: (body) => ({
          url: `${langRoute}/two-factor-challenge`,
          method: 'POST',
          data: body,
        }),
      }),
      deleteTwoFactor: builder.mutation({
        query: () => ({
          url: `${langRoute}/user/two-factor-authentication`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useGetUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useConfirmPasswordMutation,
  useConfirmPasswordStatusQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useTurnOn2FAMutation,
  useTwoFactorQrCodeQuery,
  useTwoFactorSecretKeyQuery,
  useConfirm2FAMutation,
  useGetRecoveryCodesQuery,
  usePostRecoveryCodesMutation,
  useVerifyTwoFactorMutation,
  useDeleteTwoFactorMutation,
} = userApi;
