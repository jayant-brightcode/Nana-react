import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import RNLanguageDetector from 'i18next-react-native-language-detector';
import en from './translations/en';
import es from './translations/es';
import hi from './translations/hi';
import as from './translations/as';
import gu from './translations/gu';
import kn from './translations/kn';
import ml from './translations/ml';
import mr from './translations/mr';
import or from './translations/or';
import pa from './translations/pa';
import ta from './translations/ta';
import te from './translations/te';
import ba from './translations/ba'
i18n
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
      hi: {
        translation: hi,
      },
      as: {
        translation: as,
      },
      gu: {
        translation: gu,
      },
      kn: {
        translation: kn,
      },
      ml: {
        translation: ml,
      },
      mr: {
        translation: mr,
      },
      or: {
        translation: or,
      },
      pa: {
        translation: pa,
      },
      ta: {
        translation: ta,
      },
      te: {
        translation: te,
      },
      ba: {
        translation: ba,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
