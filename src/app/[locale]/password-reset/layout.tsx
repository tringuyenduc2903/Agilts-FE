import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('reset_password_title'),
    description: t('reset_password_description'),
  };
}
export default async function ResetPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
