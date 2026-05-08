import { createContext, useContext } from 'react';
import { useApp } from './AppContext.jsx';
import { I18N } from '../utils/constants.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { lang } = useApp();
  const t = I18N[lang] || I18N.en;
  return <LanguageContext.Provider value={{ lang, t }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang inside LanguageProvider');
  return ctx;
}
