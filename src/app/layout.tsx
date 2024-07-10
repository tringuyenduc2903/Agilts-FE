import { Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { cookies } from 'next/headers';

const inter = Open_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fff',
  colorScheme: 'normal',
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = cookies().get('NEXT_LOCALE')?.value || 'vi';
  return (
    <html lang={locale}>
      <head>
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
        <Script defer src='/service-worker.js' strategy='beforeInteractive' />
        {children}
      </body>
    </html>
  );
}
