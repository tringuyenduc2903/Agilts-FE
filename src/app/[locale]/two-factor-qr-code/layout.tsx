import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('2fa_title'),
    description: t('2fa_description'),
  };
}
export default async function TwoFactorQrCodeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
