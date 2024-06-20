import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import Script from 'next/script';
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const lang = localeCookie ? localeCookie.value : 'vi';
  const messages = await getMessages();
  return (
    <html lang={lang}>
      <Script
        defer
        src='https://code.iconify.design/3/3.1.0/iconify.min.js'
      ></Script>
      <head>
        <link rel='icon' href='/favicon-32x32.png' sizes='any' />
      </head>
      <body>
        <NextIntlClientProvider locale={lang} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
