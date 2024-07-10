import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales: ['vi', 'en'],
    defaultLocale: 'vi',
    localePrefix: 'as-needed',
  });
  const response = handleI18nRouting(request);
  const { nextUrl } = request;
  response.headers.set('x-url', nextUrl.pathname);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
