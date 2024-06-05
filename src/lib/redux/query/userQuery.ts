import { getCSRFToken } from '@/lib/utils/getCsrfToken';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        headers.set('X-Requested-With', 'XMLHttpRequest');
        headers.set('X-CSRF-TOKEN', csrfToken);
      }
    },
  }),
  endpoints: (builder) => {
    return {
      register: builder.mutation({
        query: (body) => ({
          url: `/register`,
          method: 'POST',
          body: body,
        }),
      }),
    };
  },
});

export const { useRegisterMutation } = userApi;
