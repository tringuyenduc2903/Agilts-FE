import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ModalProvider } from '@/contexts/ModalProvider';
import { FetchDataProvider } from '@/contexts/FetchDataProvider';
import StoreProvider from '@/contexts/StoreProvider';
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import './globals.css';
const DynamicHeader = dynamic(
  () => import('@/components/common/Header/Header'),
  { ssr: false }
);
const DynamicScrollToTop = dynamic(
  () => import('@/components/common/Button/ScrollToTop'),
  { ssr: false }
);
const DynamicFooter = dynamic(
  () => import('@/components/common/Footer/Footer'),
  { ssr: false }
);
const DynamicModal = dynamic(() => import('@/components/modal/Modal'));
const inter = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: {
      template: `%s | Agilts`,
      default: t('home_title'),
    },
    description: t('home_description'),
    keywords: t('home_keywords'),
  };
}
export default async function HomeLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <Script
        defer
        src='https://code.iconify.design/3/3.1.0/iconify.min.js'
      ></Script>
      <body className={`${inter.className} flex flex-col justify-between`}>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <FetchDataProvider>
              <ModalProvider>
                <DynamicHeader />
                {children}
                <DynamicScrollToTop />
                <DynamicFooter />
                <DynamicModal />
              </ModalProvider>
            </FetchDataProvider>
          </StoreProvider>
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
