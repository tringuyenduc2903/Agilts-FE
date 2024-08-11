import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { VehicleRegistrationSupportProvider } from './_contexts/VehicleRegistrationSupportProvider';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('purchase'),
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
  return (
    <VehicleRegistrationSupportProvider>
      {children}
    </VehicleRegistrationSupportProvider>
  );
}
