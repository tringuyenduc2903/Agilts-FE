import { axiosInstance } from '@/config/axios';
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
