import { axiosInstance, getLangRoute } from '@/config/axios';
import { notFound } from 'next/navigation';
export const getProducts = async (search: string | null) => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/product${
        search ? `?${search}&perPage=12` : '?perPage=12'
      }`
    );
    if (res.status !== 200) return notFound();
    return {
      type: 'success',
      data: res.data,
    };
  } catch (error: any) {
    return {
      type: 'error',
      data: error?.response?.data,
    };
  }
};
export const getProductDetails = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/api${getLangRoute()}/product/${id}`);
    if (res.status !== 200) return notFound();
    return {
      type: 'success',
      data: res.data,
    };
  } catch (error: any) {
    return {
      type: 'error',
      data: error?.response?.data,
    };
  }
};
export const getFilterProduct = async () => {
  try {
    const res = await axiosInstance.get(`/api${getLangRoute()}/filter-product`);
    if (res.status !== 200) return notFound();
    return {
      type: 'success',
      data: res.data,
    };
  } catch (error: any) {
    return {
      type: 'error',
      data: error?.response?.data,
    };
  }
};
export const getProductReview = async ({
  id,
  search,
}: {
  id: string | number;
  search: string | null;
}) => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/review/${id}${search && `?${search}`}`
    );
    if (res.status !== 200) return notFound();
    return {
      type: 'success',
      data: res.data,
    };
  } catch (error: any) {
    return {
      type: 'error',
      data: error?.response?.data,
    };
  }
};

export const getFilterReview = async (id: string | number) => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/filter-review/${id}`
    );
    if (res.status !== 200) return notFound();
    return {
      type: 'success',
      data: res.data,
    };
  } catch (error: any) {
    return {
      type: 'error',
      data: error?.response?.data,
    };
  }
};

export const postReviewImage = async (body: any) => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/review-image`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    if (res.status !== 200) return notFound();
    return {
      type: 'success',
      data: res.data,
    };
  } catch (error: any) {
    return {
      type: 'error',
      data: error?.response?.data,
    };
  }
};

export const postReviewUser = async (body: any) => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/review-user`,
      body
    );
    if (res.status !== 200) return notFound();
    return {
      type: 'success',
      data: res.data,
    };
  } catch (error: any) {
    return {
      type: 'error',
      data: error?.response?.data,
    };
  }
};
