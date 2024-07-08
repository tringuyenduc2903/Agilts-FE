import { Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fff',
  colorScheme: 'normal',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const lang = localeCookie ? localeCookie.value : 'vi';
  const messages = await getMessages({
    locale: lang,
  });

  return (
    <html lang={lang}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#fff' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link rel='dns-prefetch' href='https://fonts.googleapis.com' />
        <link rel='dns-prefetch' href='https://fonts.gstatic.com' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='icon' href='/favicon-32x32.png' sizes='any' />
        <link rel='manifest' href='/site.webmanifest' />
      </head>
      <body className={`${inter.className}`}>
        <Script defer src='/service-worker.js' />
        <NextIntlClientProvider locale={lang} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
