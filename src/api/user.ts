import { axiosInstance, getLangRoute } from '@/config/axios';
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
    const res = await axiosInstance.put(
      `/api${getLangRoute()}/user/profile-information`,
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
export const login = async (body: Login) => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.post(`/api${getLangRoute()}/login`, body);
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
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/register`,
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
export const logout = async () => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.post(`/api${getLangRoute()}/logout`);
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
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/user/confirm-password`,
      { password: password }
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

export const confirmPasswordStatus = async () => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/user/confirmed-password-status`
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

export const forgotPassword = async (email: string) => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/forgot-password`,
      {
        email: email,
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

export const resetPassword = async (body: any) => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/reset-password`,
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
export const changePassword = async (body: any) => {
  try {
    await getCsrfCookie();
    const res = await axiosInstance.put(
      `/api${getLangRoute()}/user/password`,
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
export const getSocials = async () => {
  try {
    const res = await axiosInstance.get(`/api${getLangRoute()}/social`);
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
    const res = await axiosInstance.delete(
      `/api${getLangRoute()}/social/${id}`
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
export const turnOn2FA = async () => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/user/two-factor-authentication`,
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
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/user/two-factor-qr-code`
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

export const twoFactorSecretKey = async () => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/user/two-factor-secret-key`
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

export const confirm2FA = async (code: string) => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/user/confirmed-two-factor-authentication`,
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
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/user/two-factor-recovery-codes`
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

export const postRecoveryCodes = async () => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/user/two-factor-recovery-codes`
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

export const verifyTwoFactor = async (body: any) => {
  try {
    const res = await axiosInstance.post(
      `/api${getLangRoute()}/two-factor-challenge`,
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

export const turnOf2FA = async () => {
  try {
    const res = await axiosInstance.delete(
      `/api${getLangRoute()}/user/two-factor-authentication`
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
      `/api${getLangRoute()}/email/verification-notification`
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

export const getOrders = async (search: string | null) => {
  try {
    const res = await axiosInstance.get(
      `/api${getLangRoute()}/order${search ? `?${search}` : ''}`
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

export const getOrderDetails = async (id: string | number) => {
  try {
    const res = await axiosInstance.get(`/api${getLangRoute()}/order/${id}`);
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
