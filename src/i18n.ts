import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ✅ Import translations
import en from './locales/en.json';
import mr from './locales/mr.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import pa from './locales/pa.json';
import ur from './locales/ur.json';
import sa from './locales/sa.json';
import raj from './locales/raj.json';
import him from './locales/him.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {  
      en: { translation: en },
      mr: { translation: mr },
      hi: { translation: hi },
      gu: { translation: gu },
      ta: { translation: ta },
      kn: { translation: kn },
      pa: { translation: pa },
      ur: { translation: ur },
      sa: { translation: sa },
      raj: { translation: raj },
      him: { translation: him },
      fr: { translation: fr },

    },
    lng: 'gu',

    fallbackLng: 'en',

    // ✅ Let detector decide first language

    // ✅ Clean language codes (en-US → en)
    load: 'languageOnly',

    // ✅ Debug (remove in production)
    debug: false,

    interpolation: {
      escapeValue: false, // React already safe
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'], // remember user choice
    },
  });

export default i18n;