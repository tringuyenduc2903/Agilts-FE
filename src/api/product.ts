import { axiosInstance, getLangRoute } from '@/config/axios';
export const getProducts = async (
  search: string | null,
  type: 'motor-cycle' | 'square-parts' | 'accessories'
) => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/product/${type}/${
        search ? `?${search}&perPage=12` : `?perPage=12`
      }`
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
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/product/${type}/${id}`
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
export const getFilterProduct = async (
  type: 'motor-cycle' | 'square-parts' | 'accessories'
) => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/filter/product/${type}`
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
      `/api${getLangRoute()}/review/${id}${search && `?${search}`}`
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
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/filter/review/${id}`
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
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/price-quote`,
      body
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

export const purchaseMotorbike = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api${getLangRoute()}/order`, body);
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
