import { axiosInstance, getLangRoute } from '@/config/axios';
export const getWishlist = async () => {
  try {
    const res = await axiosInstance.get(`/api${getLangRoute()}/wishlist`);
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
export const createWishlist = async (body: any) => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/wishlist`,
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

export const deleteWishlist = async (id: string | number) => {
  try {
    const res = await axiosInstance.delete(
      `/api${getLangRoute()}/wishlist/${id}`
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
