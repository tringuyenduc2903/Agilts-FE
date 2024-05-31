'use client';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import EnglishHeader from './locales/en/header.json';
import EnglishCommon from './locales/en/common.json';
import EnglishFooter from './locales/en/footer.json';
import VietnameseHeader from './locales/vie/header.json';
import VietnameseCommon from './locales/vie/common.json';
import VietnameseFooter from './locales/vie/footer.json';
import type { FC } from 'react';

const resources = {
  en: {
    header: EnglishHeader,
    common: EnglishCommon,
    footer: EnglishFooter,
  },
  vie: {
    header: VietnameseHeader,
    common: VietnameseCommon,
    footer: VietnameseFooter,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng:
    typeof window !== 'undefined'
      ? window.localStorage.getItem('agilts-customer') || 'vie'
      : 'vie',
  fallbackLng: 'vie',
  interpolation: {
    escapeValue: false,
  },
});
export const I18nProvider: FC<any> = ({ children }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
