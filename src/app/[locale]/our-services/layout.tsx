import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('our_services_title'),
    description: t('our_services_description'),
  };
}
export default async function OurServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
