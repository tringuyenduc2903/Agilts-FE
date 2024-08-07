import { axiosInstance, getLangRoute } from '@/config/axios';

export const getAddress = async () => {
  try {
    const res = await axiosInstance.get(`/api${getLangRoute()}/address`);
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

export const createAddress = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api${getLangRoute()}/address`, body);
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

export const updateAddress = async ({
  body,
  address_id,
}: {
  body: any;
  address_id: string | number;
}) => {
  try {
    const res = await axiosInstance.put(
      `/api${getLangRoute()}/address/${address_id}`,
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

export const deleteAddress = async (id: string | number) => {
  try {
    const res = await axiosInstance.delete(
      `/api${getLangRoute()}/address/${id}`
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
