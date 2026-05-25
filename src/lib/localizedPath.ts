import type {Locale} from '@/i18n/config';

export function localizedPath(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) {
    return href;
  }

  const withoutLocale = href.replace(/^\/(en|it)(?=\/|$)/, '') || '/';
  return locale === 'it'
    ? `/it${withoutLocale === '/' ? '' : withoutLocale}`
    : withoutLocale;
}
