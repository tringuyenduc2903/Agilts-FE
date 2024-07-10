import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    localePrefix: 'as-needed',
  });

  const response = handleI18nRouting(request);
  const { nextUrl } = request;
  const validLang = locales.includes(nextUrl.pathname.split('/')[1]);

  if (validLang) {
    response.cookies.set('NEXT_LOCALE', nextUrl.pathname.split('/')[1]);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
