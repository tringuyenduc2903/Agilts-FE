import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: ['vi', 'en'],
    // Used when no locale matches
    defaultLocale: 'vi',
  });
  const response = handleI18nRouting(request);

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|.*\\..*).*)'],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
};
