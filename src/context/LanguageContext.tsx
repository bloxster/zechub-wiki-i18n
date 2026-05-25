"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import type {Locale} from '@/i18n/config';
import {localizedPath} from '@/lib/localizedPath';

export interface Language {
  code: Locale;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  {code: 'en', label: 'English', nativeLabel: 'English', flag: 'EN'},
  {code: 'it', label: 'Italian', nativeLabel: 'Italiano', flag: 'IT'},
];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  currentLanguage: Language;
  t: Record<string, any>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale,
  messages,
}: {
  children: ReactNode;
  initialLocale: Locale;
  messages: Record<string, any>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLocale = useCallback(
    (locale: Locale) => {
      const nextPath = localizedPath(pathname || '/', locale);
      const query = searchParams?.toString() ?? '';
      const nextUrl = query ? `${nextPath}?${query}` : nextPath;

      // Locale is resolved in the proxy and root layout, which client-side
      // navigation preserves. Reload the document to receive the new locale.
      window.location.assign(nextUrl);
    },
    [pathname, searchParams],
  );

  const currentLanguage =
    LANGUAGES.find((language) => language.code === initialLocale) ?? LANGUAGES[0];

  const value = useMemo(
    () => ({locale: initialLocale, setLocale, currentLanguage, t: messages}),
    [initialLocale, messages, setLocale, currentLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within <LanguageProvider>');
  }
  return context;
}
