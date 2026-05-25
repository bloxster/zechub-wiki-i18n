export const locales = ['en', 'it'] as const;
export type Locale = (typeof locales)[number];

export const i18n = {
  defaultLocale: 'en' as Locale,
  locales,
} as const;
