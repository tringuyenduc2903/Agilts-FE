import { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { I18nProvider } from '@/lib/i18n/i18n';
import { ModalProvider } from '@/contexts/ModalProvider';
import { FetchDataProvider } from '@/contexts/FetchDataProvider';
import StoreProvider from '@/contexts/StoreProvider';
import dynamic from 'next/dynamic';
import './globals.css';
import Script from 'next/script';
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

// export async function generateMetadata(): Promise<Metadata> {
//   return {
//     title: {
//       template: `%s | Agilts`,
//       default: 'Trang chủ Agilts',
//     },
//     description: 'Trang chủ của Agilts',
//     keywords: 'xe may, xe máy',
//   };
// }
export const metadata: Metadata = {
  title: {
    template: `%s | Agilts`,
    default: 'Trang chủ Agilts',
  },
  description: 'Trang chủ của Agilts',
  keywords: 'xe may, xe máy',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi'>
      <Script
        defer
        src='https://code.iconify.design/3/3.1.0/iconify.min.js'
      ></Script>
      <body className={`${inter.className} flex flex-col justify-between`}>
        <StoreProvider>
          <FetchDataProvider>
            <I18nProvider>
              <ModalProvider>
                <DynamicHeader />
                {children}
                <DynamicScrollToTop />
                <DynamicFooter />
                <DynamicModal />
              </ModalProvider>
            </I18nProvider>
          </FetchDataProvider>
        </StoreProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
