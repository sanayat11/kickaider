import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationRu from './locales/ru.json';
import translationEn from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    debug: false,
    resources: {
      ru: { translation: translationRu },
      en: { translation: translationEn },
    },
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
