import { title } from '@/config/config';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    robots: { index: true, follow: true },
    title: t('stores_title'),
    description: t('stores_description', { name: title }),
  };
}
export default async function StoresLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale || 'vi');
  return <>{children}</>;
}
