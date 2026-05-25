import {headers} from 'next/headers';
import {i18n, type Locale} from './config';

export async function getRequestLocale(): Promise<Locale> {
  const locale = (await headers()).get('x-zechub-locale');
  return locale === 'it' ? 'it' : i18n.defaultLocale;
}
