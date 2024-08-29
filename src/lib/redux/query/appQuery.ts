import { axiosBaseQuery } from '@/config/axios';
import { createApi } from '@reduxjs/toolkit/query/react';
export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'address',
    'document',
    'cart',
    'reviews',
    'wishlist',
    'social',
    'orders',
  ],
  endpoints: (builder) => {
    return {
      getCsrfCookie: builder.mutation({
        query: () => ({
          url: '/sanctum/csrf-cookie',
          method: 'GET',
        }),
      }),
      getUser: builder.mutation({
        query: () => {
          return {
            url: `/api/user`,
            method: 'GET',
          };
        },
      }),
      login: builder.mutation({
        query: (body) => ({
          url: `/api/login`,
          method: 'POST',
          data: body,
        }),
      }),
      register: builder.mutation({
        query: (body) => ({
          url: `/api/register`,
          method: 'POST',
          data: body,
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          url: `/api/logout`,
          method: 'POST',
        }),
      }),
      confirmPassword: builder.mutation({
        query: (body) => ({
          url: `/api/user/confirm-password`,
          method: 'POST',
          data: body,
        }),
      }),
      confirmPasswordStatus: builder.query({
        query: () => ({
          url: `/api/user/confirmed-password-status`,
          method: 'GET',
        }),
      }),
      forgotPassword: builder.mutation({
        query: (body) => ({
          url: `/api/forgot-password`,
          method: 'POST',
          data: body,
        }),
      }),
      resetPassword: builder.mutation({
        query: (body) => ({
          url: `/api/reset-password`,
          method: 'POST',
          data: body,
        }),
      }),
      changePassword: builder.mutation({
        query: (body) => ({
          url: `/api/user/password`,
          method: 'PUT',
          data: body,
        }),
      }),
      turnOn2fa: builder.mutation({
        query: (body) => ({
          url: `/api/user/two-factor-authentication`,
          method: 'POST',
          data: body,
        }),
      }),
      twoFactorQrCode: builder.query({
        query: () => ({
          url: `/api/user/two-factor-qr-code`,
          method: 'GET',
        }),
      }),
      twoFactorSecretKey: builder.query({
        query: () => ({
          url: `/api/user/two-factor-secret-key`,
          method: 'GET',
        }),
      }),
      confirm2FA: builder.mutation({
        query: (body) => ({
          url: `/api/user/confirmed-two-factor-authentication`,
          method: 'POST',
          data: body,
        }),
      }),
      getRecoveryCodes: builder.query({
        query: () => ({
          url: `/api/user/two-factor-recovery-codes`,
          method: 'GET',
        }),
      }),
      postRecoveryCodes: builder.mutation({
        query: () => ({
          url: `/api/user/two-factor-recovery-codes`,
          method: 'POST',
        }),
      }),
      verifyTwoFactor: builder.mutation({
        query: (body) => ({
          url: `/api/two-factor-challenge`,
          method: 'POST',
          data: body,
        }),
      }),
      turnOf2FA: builder.mutation({
        query: () => ({
          url: `/api/user/two-factor-authentication`,
          method: 'POST',
        }),
      }),
      getAddress: builder.query({
        query: () => ({
          url: `/api/address`,
          method: 'GET',
        }),
        providesTags: ['address'],
      }),
      createAddress: builder.mutation({
        query: (body) => ({
          url: `/api/address`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['address'],
      }),
      updateAddress: builder.mutation({
        query: ({ body, id }) => ({
          url: `/api/address/${id}`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['address'],
      }),
      deleteAddress: builder.mutation({
        query: (id) => ({
          url: `/api/address/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['address'],
      }),
      getDocument: builder.query({
        query: () => ({
          url: `/api/identification`,
          method: 'GET',
        }),
        providesTags: ['document'],
      }),
      createDocument: builder.mutation({
        query: (body) => ({
          url: `/api/identification`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['document'],
      }),
      updateDocument: builder.mutation({
        query: ({ body, id }) => ({
          url: `/api/identification/${id}`,
          method: 'PUT',
          data: body,
        }),
        invalidatesTags: ['document'],
      }),
      deleteDocument: builder.mutation({
        query: (id) => ({
          url: `/api/identification/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['document'],
      }),
      getCart: builder.query({
        query: () => ({
          url: `/api/cart`,
          method: 'GET',
        }),
        providesTags: ['cart'],
      }),
      createCart: builder.mutation({
        query: (body) => ({
          url: `/api/cart`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['cart'],
      }),
      updateCart: builder.mutation({
        query: ({ id, amount }) => ({
          url: `/api/cart/${id}`,
          method: 'PUT',
          data: {
            amount: amount,
          },
        }),
        invalidatesTags: ['cart'],
      }),
      deleteCart: builder.mutation({
        query: (id) => ({
          url: `/api/cart/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['cart'],
      }),
      getWishlist: builder.query({
        query: () => ({
          url: `/api/wishlist`,
          method: 'GET',
        }),
        providesTags: ['wishlist'],
      }),
      createWishlist: builder.mutation({
        query: (version) => ({
          url: `/api/wishlist`,
          method: 'POST',
          data: {
            version: version,
          },
        }),
        invalidatesTags: ['wishlist'],
      }),
      deleteWishlist: builder.mutation({
        query: (id) => ({
          url: `/api/wishlist/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['wishlist'],
      }),
      getSocials: builder.query({
        query: () => ({
          url: `/api/social`,
          method: 'GET',
        }),
        providesTags: ['social'],
      }),
      deleteSocial: builder.mutation({
        query: (id) => ({
          url: `/api/social/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['social'],
      }),
      resendVerifyAccount: builder.mutation({
        query: () => ({
          url: `/api/email/verification-notification`,
          method: 'POST',
        }),
      }),
      updateUser: builder.mutation({
        query: (body) => ({
          url: `/api/user/profile-information`,
          method: 'PUT',
          data: body,
        }),
      }),
      getOrders: builder.query({
        query: (search) => ({
          url: `/api/order${search ? `?${search}` : ''}`,
          method: 'GET',
        }),
        providesTags: ['orders'],
      }),
      getOrderDetails: builder.query({
        query: (id) => ({
          url: `/api/order/${id}`,
          method: 'GET',
        }),
        providesTags: ['orders'],
      }),
      createOrder: builder.mutation({
        query: (body) => ({
          url: `/api/order`,
          method: 'POST',
          data: body,
        }),
        invalidatesTags: ['orders'],
      }),
      getProducts: builder.query({
        query: ({ search, perPage, type }) => ({
          url: `/api/product/${type}?perPage=${perPage}${
            search ? `&${search}` : ``
          }`,
          method: 'GET',
        }),
      }),
      getFilterProduct: builder.query({
        query: (type) => ({
          url: `/api/filter/product/${type}`,
          method: 'GET',
        }),
      }),
      postPriceQuote: builder.mutation({
        query: (body) => ({
          url: `/price-quote`,
          method: 'POST',
          body: body,
        }),
      }),
      getSettings: builder.query({
        query: (setting_type) => ({
          url: `/setting/${setting_type}`,
          method: 'GET',
        }),
      }),
      getStores: builder.query({
        query: ({ search, perPage }) => ({
          url: `/api/branch?perPage=${perPage ? perPage : '16'}${
            search ? `&${search}` : ''
          }`,
          method: 'GET',
        }),
      }),
    };
  },
});

export const {
  useGetCsrfCookieMutation,
  useGetUserMutation,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useConfirmPasswordMutation,
  useConfirmPasswordStatusQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useTurnOn2faMutation,
  useTwoFactorQrCodeQuery,
  useTwoFactorSecretKeyQuery,
  useConfirm2FAMutation,
  useGetRecoveryCodesQuery,
  usePostRecoveryCodesMutation,
  useVerifyTwoFactorMutation,
  useTurnOf2FAMutation,
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useGetCartQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetWishlistQuery,
  useCreateWishlistMutation,
  useDeleteWishlistMutation,
  useGetSocialsQuery,
  useDeleteSocialMutation,
  useResendVerifyAccountMutation,
  useUpdateUserMutation,
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useGetProductsQuery,
  useGetFilterProductQuery,
  usePostPriceQuoteMutation,
  useGetSettingsQuery,
  useGetStoresQuery,
} = appApi;
