'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { detectLocale, useTranslation, Translation } from '../utils/localization';

interface LocaleContextType {
  locale: 'ru' | 'en';
  setLocale: (locale: 'ru' | 'en') => void;
  t: Translation;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Start with browser-detected locale to reduce loading time
  const getInitialLocale = (): 'ru' | 'en' => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.substring(0, 2).toLowerCase();
      return browserLang === 'ru' ? 'ru' : 'en';
    }
    return 'en';
  };
  
  const [locale, setLocale] = useState<'ru' | 'en'>(getInitialLocale());
  const [isLoading, setIsLoading] = useState(false); // Start as false for immediate rendering
  const t = useTranslation(locale);

  useEffect(() => {
    // Run locale detection in background to potentially update if IP-based detection differs
    detectLocale().then((detectedLocale) => {
      if (detectedLocale !== locale) {
        setLocale(detectedLocale);
      }
    }).catch(() => {
      // If detection fails, keep current browser-based locale
    });
  }, []); // Empty dependency array to run only once

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
