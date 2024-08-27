import { axiosInstance } from '@/config/axios';

export const getDocuments = async () => {
  try {
    const res = await axiosInstance.get(`/api/identification`);
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

export const createDocument = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api/identification`, body);
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

export const updateDocument = async ({
  body,
  id,
}: {
  body: any;
  id: string | number;
}) => {
  try {
    const res = await axiosInstance.put(`/api/document/${id}`, body);
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

export const deleteDocument = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/api/identification/${id}`);
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
