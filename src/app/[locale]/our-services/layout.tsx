import { title } from '@/config/config';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('our_services_title'),
    description: t('our_services_description', { name: title }),
  };
}
export default async function OurServicesLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale || 'vi');

  return <>{children}</>;
}
