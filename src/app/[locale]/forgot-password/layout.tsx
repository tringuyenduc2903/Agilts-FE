import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('forgot_password_title'),
    description: t('forgot_password_description'),
  };
}
export default async function ForgotPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
