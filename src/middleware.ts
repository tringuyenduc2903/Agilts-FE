import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: ['vi', 'en'],
    // Used when no locale matches
    defaultLocale: 'vi',
  });
  const nonce = Buffer.from(uuidv4()).toString('base64');
  const response = handleI18nRouting(request);
  response.headers.set('x-nonce', nonce);

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
