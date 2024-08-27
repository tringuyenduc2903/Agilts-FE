import { axiosInstance } from '@/config/axios';
import { getCsrfCookie } from './csrfCookie';
import { Login, Register } from '@/types/types';
export const getUser = async () => {
  try {
    const res = await axiosInstance.get(`/api/user`);
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
export const updateUser = async (body: any) => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.put(`/api/user/profile-information`, body);
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
export const login = async (body: Login) => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.post(`/api/login`, body);
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

export const registerAccount = async (body: Register) => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.post(`/api/register`, body);
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
export const logout = async () => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.post(`/api/logout`);
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

export const confirmPassword = async (password: string) => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.post(`/api/user/confirm-password`, {
      password: password,
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

export const confirmPasswordStatus = async () => {
  try {
    const res = await axiosInstance.get(`/api/user/confirmed-password-status`);
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

export const forgotPassword = async (email: string) => {
  try {
    const res = await axiosInstance.post(`/api/forgot-password`, {
      email: email,
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

export const resetPassword = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api/reset-password`, body);
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
export const changePassword = async (body: any) => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.put(`/api/user/password`, body);
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
export const getSocials = async () => {
  try {
    const res = await axiosInstance.get(`/api/social`);
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
export const deleteSocial = async (id: string | number) => {
  try {
    const res = await axiosInstance.delete(`/api/social/${id}`);
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
export const turnOn2FA = async () => {
  try {
    const res = await axiosInstance.post(
      `/api/user/two-factor-authentication`,
      {
        force: true,
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

export const twoFactorQrCode = async () => {
  try {
    const res = await axiosInstance.get(`/api/user/two-factor-qr-code`);
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

export const twoFactorSecretKey = async () => {
  try {
    const res = await axiosInstance.get(`/api/user/two-factor-secret-key`);
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

export const confirm2FA = async (code: string) => {
  try {
    const res = await axiosInstance.post(
      `/api/user/confirmed-two-factor-authentication`,
      { code: code }
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

export const getRecoveryCodes = async () => {
  try {
    const res = await axiosInstance.get(`/api/user/two-factor-recovery-codes`);
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

export const postRecoveryCodes = async () => {
  try {
    const res = await axiosInstance.post(`/api/user/two-factor-recovery-codes`);
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

export const verifyTwoFactor = async (body: any) => {
  try {
    const res = await axiosInstance.post(`/api/two-factor-challenge`, body);
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

export const turnOf2FA = async () => {
  try {
    const res = await axiosInstance.delete(
      `/api/user/two-factor-authentication`
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

export const resendVerifyAccount = async () => {
  try {
    const res = await axiosInstance.post(
      `/api/email/verification-notification`
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
export const getCart = async () => {
  try {
    const res = await axiosInstance.get(`/api/cart`);
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
export const getOrders = async (search: string | null) => {
  try {
    const res = await axiosInstance.get(
      `/api/order${search ? `?${search}` : ''}`
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
export const updateCart = async (id: number, amount: number) => {
  try {
    const res = await axiosInstance.put(`/api/cart/${id}`, {
      amount: amount,
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
export const deleteCart = async (id: number) => {
  try {
    const res = await axiosInstance.delete(`/api/cart/${id}`);
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
export const getOrderDetails = async (id: string | number) => {
  try {
    const res = await axiosInstance.get(`/api/order/${id}`);
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
