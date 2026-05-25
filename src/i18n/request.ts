import {getRequestConfig} from 'next-intl/server';
import {getDictionary} from '@/lib/getDictionary';
import {getRequestLocale} from './request-locale';

export default getRequestConfig(async () => {
  const locale = await getRequestLocale();

  return {
    locale,
    messages: await getDictionary(locale),
  };
});
