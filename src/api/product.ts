import { axiosInstance } from '@/config/axios';
export const getProducts = async (
  search: string | null,
  perPage: number,
  type: 'motor-cycle' | 'square-parts' | 'accessories'
) => {
  try {
    const res = await axiosInstance.get(
      `/api/product/${type}?perPage=${perPage}${search ? `&${search}` : ``}`
    );
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
export const getProductDetails = async (
  id: string,
  type: 'motor-cycle' | 'square-parts' | 'accessories'
) => {
  try {
    const res = await axiosInstance.get(`/api/product/${type}/${id}`);
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
export const getFilterProduct = async (
  search: string,
  type: 'motor-cycle' | 'square-parts' | 'accessories'
) => {
  try {
    const res = await axiosInstance.get(
      `/api/filter/product/${type}${search ? `?${search}` : ''}`
    );
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
      `/api/review/${id}${search && `?${search}`}`
    );
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
    const res = await axiosInstance.get(`/api/filter/review/${id}`);
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
    const res = await axiosInstance.post(`/api/review-image`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    const res = await axiosInstance.post(`/api/review-user`, body);
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

export const postPriceQuote = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api/price-quote`, body);
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
export const postCart = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api/cart`, body);
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
export const purchaseMotorbike = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api/order`, body);
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

export const purchaseItem = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api/order`, body);
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
