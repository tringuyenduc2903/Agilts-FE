import { axiosInstance } from '@/config/axios';
// import { getCookie } from 'cookies-next';
export const getCsrfCookie = () => axiosInstance.get(`/sanctum/csrf-cookie`);
