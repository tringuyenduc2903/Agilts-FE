import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import type { AxiosRequestConfig, AxiosError, AxiosHeaders } from 'axios';

export const axiosBaseQuery =
  (
    {
      baseUrl,
      prepareHeaders,
    }: { baseUrl: string; prepareHeaders?: (headers: Headers) => Headers } = {
      baseUrl: '',
    }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers = {} }) => {
    let preparedHeaders = new Headers(headers as AxiosHeaders);
    if (prepareHeaders) {
      preparedHeaders = prepareHeaders(preparedHeaders);
    }

    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...Object.fromEntries(preparedHeaders.entries()),
        },
        withCredentials: true,
        withXSRFToken: true,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };
