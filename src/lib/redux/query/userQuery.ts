import { getCookies } from 'cookies-next';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';
const getLangRoute = () => {
  const cookies = getCookies();
  const curLang = cookies?.NEXT_LOCALE || 'vi';
  return curLang === 'en' ? '/en' : '';
};
console.log(getLangRoute());
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
          url: `${getLangRoute()}/login`,
          method: 'POST',
          data: body,
        }),
      }),
      register: builder.mutation({
        query: (body) => ({
          url: `${getLangRoute()}/register`,
          method: 'POST',
          data: body,
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          url: `${getLangRoute()}/logout`,
          method: 'POST',
        }),
        invalidatesTags: ['users'],
      }),
      updateUser: builder.mutation({
        query: (body) => ({
          url: `${getLangRoute()}/user/profile-information`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['users'],
      }),
      confirmPassword: builder.mutation({
        query: (password) => ({
          url: `${getLangRoute()}/user/confirm-password`,
          method: 'POST',
          data: {
            password: password,
          },
        }),
      }),
      confirmPasswordStatus: builder.query({
        query: () => ({
          url: `${getLangRoute()}/user/confirmed-password-status`,
        }),
      }),
      forgotPassword: builder.mutation({
        query: (email) => ({
          url: `${getLangRoute()}/forgot-password`,
          method: 'POST',
          data: {
            email: email,
          },
        }),
      }),
      resetPassword: builder.mutation({
        query: (body) => ({
          url: `${getLangRoute()}/reset-password`,
          method: 'POST',
          data: body,
        }),
      }),
      changePassword: builder.mutation({
        query: (body) => ({
          url: `${getLangRoute()}/user/password`,
          method: 'PUT',
          data: body,
        }),
      }),
      turnOn2FA: builder.mutation({
        query: () => ({
          url: `${getLangRoute()}/user/two-factor-authentication`,
          method: 'POST',
          body: {
            force: true,
          },
        }),
      }),
      twoFactorQrCode: builder.query({
        query: () => ({
          url: `${getLangRoute()}/user/two-factor-qr-code`,
        }),
      }),
      twoFactorSecretKey: builder.query({
        query: () => ({
          url: `${getLangRoute()}/user/two-factor-secret-key`,
        }),
      }),
      confirm2FA: builder.mutation({
        query: (code) => ({
          url: `${getLangRoute()}/user/confirmed-two-factor-authentication`,
          method: 'POST',
          data: {
            code: code,
          },
        }),
        invalidatesTags: ['users'],
      }),
      getRecoveryCodes: builder.query({
        query: () => ({
          url: `${getLangRoute()}/user/two-factor-recovery-codes`,
        }),
        providesTags: ['recover_codes'],
      }),
      postRecoveryCodes: builder.mutation({
        query: () => ({
          url: `${getLangRoute()}/user/two-factor-recovery-codes`,
          method: 'POST',
        }),
        invalidatesTags: ['recover_codes'],
      }),
      verifyTwoFactor: builder.mutation({
        query: (body) => ({
          url: `${getLangRoute()}/two-factor-challenge`,
          method: 'POST',
          data: body,
        }),
      }),
      deleteTwoFactor: builder.mutation({
        query: () => ({
          url: `${getLangRoute()}/user/two-factor-authentication`,
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
