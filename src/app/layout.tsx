import { Viewport } from 'next';
import { Open_Sans } from 'next/font/google';
import Script from 'next/script';
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ModalProvider } from '@/contexts/ModalProvider';
import { Analytics } from '@vercel/analytics/react';
import { title } from '@/config/config';
import { PopupProvider } from '@/contexts/PopupProvider';
import StoreProvider from '@/contexts/StoreProvider';
import { UserProvider } from '@/contexts/UserProvider';
import './globals.css';
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
export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: true, follow: true },
    title: {
      template: `%s | ${title}`,
      default: `Trang chủ ${title}`,
    },
    description: `Tại ${title}, chúng tôi hiểu rằng xe máy không chỉ là phương tiện di chuyển, mà còn là niềm đam mê và phong cách sống. Chúng tôi tự hào cung cấp một loạt các dòng xe đa dạng, từ xe tay ga tiện dụng đến xe mô tô mạnh mẽ, phù hợp với mọi nhu cầu và sở thích của bạn.`,
    keywords: 'honda, xe may, xe máy',
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
      description: '',
      images: [
        {
          url: `${process.env.NEXT_CLIENT_URL}/logo.png`,
        },
      ],
    },
    other: {
      'google-site-verification': process.env
        .NEXT_GOOGLE_SEARCH_CONSOLE as string,
    },
  };
}

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
        <StoreProvider>
          <UserProvider>
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
          </UserProvider>
        </StoreProvider>
        <Analytics debug={false} />
        <SpeedInsights />
        <Script defer src='/service-worker.js' strategy='beforeInteractive' />
      </body>
    </html>
  );
}
