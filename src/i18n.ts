import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
// Can be imported from a shared config
export const locales = ['vi', 'en'];

export default getRequestConfig(async ({ locale }: { locale: string }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
  };
});
