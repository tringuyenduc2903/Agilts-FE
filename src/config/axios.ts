import { getCookies } from 'cookies-next';
import axios from 'axios';
export const getLangRoute = () => {
  const cookies = getCookies();
  const curLang = cookies?.NEXT_LOCALE || 'vi';
  return curLang === 'en' ? '/en' : '';
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});
