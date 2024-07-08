import { getCookies } from 'cookies-next';
export const getLangRoute = () => {
  const cookies = getCookies();
  const curLang = cookies?.NEXT_LOCALE || 'vi';
  return curLang === 'en' ? '/en' : '';
};
