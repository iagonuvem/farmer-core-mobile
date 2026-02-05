/**
 * i18n Configuration
 * Default: Portuguese (Brazil)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';

export const resources = {
  'pt-BR': { translation: ptBR },
  'en': { translation: en }
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // Default language
    fallbackLng: 'pt-BR',
    
    interpolation: {
      escapeValue: false // React already escapes
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;

export type TranslationKey = keyof typeof ptBR;
