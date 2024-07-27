import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from 'next-intl/server';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ModalProvider } from '@/contexts/ModalProvider';
import { FetchDataProvider } from '@/contexts/FetchDataProvider';
import { Analytics } from '@vercel/analytics/react';
import { title } from '@/config/config';
import { PopupProvider } from '@/contexts/PopupProvider';
import { locales } from '@/i18n';
import StoreProvider from '@/contexts/StoreProvider';

const DynamicHeader = dynamic(
  () => import('@/components/common/Header/Header'),
  { ssr: false }
);
const DynamicScrollToTop = dynamic(
  () => import('@/components/common/Button/ScrollToTop'),
  { ssr: true }
);
const DynamicFooter = dynamic(
  () => import('@/components/common/Footer/Footer'),
  { ssr: false }
);
const DynamicModal = dynamic(() => import('@/components/modal/Modal'), {
  ssr: true,
});
const DynamicPopup = dynamic(() => import('@/components/popup/Popup'), {
  ssr: true,
});
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: {
      template: `%s | ${title}`,
      default: t('home_title', { name: title }),
    },
    description: t('home_description', { name: title }),
    keywords: t('home_keywords'),
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      type: 'website',
      url: process.env.NEXT_CLIENT_URL,
      description: t('home_description', { name: title }),
      images: [
        {
          url: `${process.env.NEXT_CLIENT_URL}/logo.png`,
        },
      ],
    },
  };
}

export default async function HomeLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale || 'vi');
  const messages = await getMessages({
    locale: locale,
  });

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <FetchDataProvider>
              <PopupProvider>
                <ModalProvider>
                  <DynamicHeader />
                  {children}
                  <DynamicScrollToTop />
                  <DynamicFooter />
                  <DynamicModal />
                  <DynamicPopup />
                </ModalProvider>
              </PopupProvider>
            </FetchDataProvider>
          </StoreProvider>
          <Analytics debug={false} />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
