import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ModalProvider } from '@/contexts/ModalProvider';
import { FetchDataProvider } from '@/contexts/FetchDataProvider';
import { getTranslations } from 'next-intl/server';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import StoreProvider from '@/contexts/StoreProvider';
import dynamic from 'next/dynamic';
import { title } from '@/config/config';
import { cookies } from 'next/headers';
// const DynamicIntro = dynamic(
//   () => import('../../components/common/Intro/Intro'),
//   {
//     ssr: false,
//   }
// );
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
  };
}
export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const lang = localeCookie ? localeCookie.value : 'vi';
  return (
    <html lang={lang}>
      <body className='flex flex-col justify-between'>
        <Script defer src='/service-worker.js' />
        <StoreProvider>
          <FetchDataProvider>
            <ModalProvider>
              {/* <DynamicIntro /> */}
              <DynamicHeader />
              {children}
              <DynamicScrollToTop />
              <DynamicFooter />
              <DynamicModal />
            </ModalProvider>
          </FetchDataProvider>
        </StoreProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
