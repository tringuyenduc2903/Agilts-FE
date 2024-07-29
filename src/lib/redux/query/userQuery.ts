import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../config/axios';
import { getLangRoute } from '../config/getLangRoute';
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api${getLangRoute()}`,
  }),
  tagTypes: ['users', 'recover_codes', 'address', 'documents', 'social'],
  endpoints: (builder) => {
    return {
      getUser: builder.query({
        query: () => ({
          url: `/user`,
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
      register: builder.mutation({
        query: (body) => ({
          url: `/register`,
          method: 'POST',
          data: body,
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          url: `/logout`,
          method: 'POST',
        }),
        invalidatesTags: ['users'],
      }),
      updateUser: builder.mutation({
        query: (body) => ({
          url: `/user/profile-information`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['users'],
      }),
      confirmPassword: builder.mutation({
        query: (password) => ({
          url: `/user/confirm-password`,
          method: 'POST',
          data: {
            password: password,
          },
        }),
      }),
      confirmPasswordStatus: builder.query({
        query: () => ({
          url: `/user/confirmed-password-status`,
        }),
      }),
      forgotPassword: builder.mutation({
        query: (email) => ({
          url: `/forgot-password`,
          method: 'POST',
          data: {
            email: email,
          },
        }),
      }),
      resetPassword: builder.mutation({
        query: (body) => ({
          url: `/reset-password`,
          method: 'POST',
          data: body,
        }),
      }),
      changePassword: builder.mutation({
        query: (body) => ({
          url: `/user/password`,
          method: 'PUT',
          data: body,
        }),
      }),
      turnOn2FA: builder.mutation({
        query: () => ({
          url: `/user/two-factor-authentication`,
          method: 'POST',
          body: {
            force: true,
          },
        }),
      }),
      twoFactorQrCode: builder.query({
        query: () => ({
          url: `/user/two-factor-qr-code`,
        }),
      }),
      twoFactorSecretKey: builder.query({
        query: () => ({
          url: `/user/two-factor-secret-key`,
        }),
      }),
      confirm2FA: builder.mutation({
        query: (code) => ({
          url: `/user/confirmed-two-factor-authentication`,
          method: 'POST',
          data: {
            code: code,
          },
        }),
        invalidatesTags: ['users'],
      }),
      getRecoveryCodes: builder.query({
        query: () => ({
          url: `/user/two-factor-recovery-codes`,
        }),
        providesTags: ['recover_codes'],
      }),
      postRecoveryCodes: builder.mutation({
        query: () => ({
          url: `/user/two-factor-recovery-codes`,
          method: 'POST',
        }),
        invalidatesTags: ['recover_codes'],
      }),
      verifyTwoFactor: builder.mutation({
        query: (body) => ({
          url: `/two-factor-challenge`,
          method: 'POST',
          data: body,
        }),
      }),
      deleteTwoFactor: builder.mutation({
        query: () => ({
          url: `/user/two-factor-authentication`,
          method: 'DELETE',
        }),
      }),
      resendVerifyAccount: builder.mutation({
        query: () => ({
          url: `/email/verification-notification`,
          method: 'POST',
        }),
      }),
      getAddress: builder.query({
        query: () => ({
          url: `/address`,
          method: 'GET',
        }),
        providesTags: ['address'],
      }),
      postAddress: builder.mutation({
        query: (body) => ({
          url: `/address`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['address'],
      }),
      updateAddress: builder.mutation({
        query: ({ body, address_id }) => ({
          url: `/address/${address_id}`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['address'],
      }),
      deleteAddress: builder.mutation({
        query: (id) => ({
          url: `/address/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['address'],
      }),
      getDocuments: builder.query({
        query: () => ({
          url: `/identification`,
          method: 'GET',
        }),
        providesTags: ['documents'],
      }),
      postDocument: builder.mutation({
        query: (body) => ({
          url: `/identification`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['documents'],
      }),
      updateDocument: builder.mutation({
        query: ({ body, id }) => ({
          url: `/identification/${id}`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['documents'],
      }),
      deleteDocument: builder.mutation({
        query: (id) => ({
          url: `/identification/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['documents'],
      }),
      getSocials: builder.query({
        query: () => ({
          url: `/social`,
          method: 'GET',
        }),
        providesTags: ['social'],
      }),
      deleteSocial: builder.mutation({
        query: (id) => ({
          url: `/social/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['social'],
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
  useResendVerifyAccountMutation,
  useGetAddressQuery,
  usePostAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetDocumentsQuery,
  usePostDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetSocialsQuery,
  useDeleteSocialMutation,
} = userApi;
