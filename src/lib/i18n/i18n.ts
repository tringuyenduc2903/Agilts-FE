import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EnglishHeader from './locales/en/header.json';
import EnglishCommon from './locales/en/common.json';
import EnglishFooter from './locales/en/footer.json';
import VietnameseHeader from './locales/vi/header.json';
import VietnameseCommon from './locales/vi/common.json';
import VietnameseFooter from './locales/vi/footer.json';

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
  lng: window.localStorage.getItem('agilts') || 'vie',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
