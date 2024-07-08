import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ModalProvider } from '@/contexts/ModalProvider';
import { FetchDataProvider } from '@/contexts/FetchDataProvider';
import { Analytics } from '@vercel/analytics/react';
import StoreProvider from '@/contexts/StoreProvider';
import { title } from '@/config/config';

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
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const lang = localeCookie ? localeCookie.value : 'vi';

  return (
    <html lang={lang}>
      <body className='flex flex-col justify-between'>
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
        <Analytics debug={false} />
        <SpeedInsights />
      </body>
    </html>
  );
}
