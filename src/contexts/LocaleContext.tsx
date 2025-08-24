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
  // Always start with 'ru' to prevent hydration mismatch
  const [locale, setLocale] = useState<'ru' | 'en'>('ru');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslation(locale);

  useEffect(() => {
    setIsMounted(true);

    // Only detect locale after component is mounted to prevent hydration mismatch
    const getClientLocale = (): 'ru' | 'en' => {
      // Check localStorage first
      const savedLocale = localStorage.getItem('locale');
      if (savedLocale === 'ru' || savedLocale === 'en') {
        return savedLocale;
      }

      // Fallback to browser language
      if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.substring(0, 2).toLowerCase();
        return browserLang === 'ru' ? 'ru' : 'en';
      }
      return 'ru';
    };

    const clientLocale = getClientLocale();
    if (clientLocale !== locale) {
      setLocale(clientLocale);
    }

    // Run background IP-based detection
    detectLocale().then((detectedLocale) => {
      if (detectedLocale !== clientLocale) {
        setLocale(detectedLocale);
      }
    }).catch(() => {
      // If detection fails, keep current locale
    });
  }, []);

  // Save locale to localStorage when it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('locale', locale);
    }
  }, [locale, isMounted]);

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
