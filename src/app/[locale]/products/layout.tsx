import { title } from '@/config/config';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import './_css/index.css';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    robots: { index: true, follow: true },
    title: t('product_title'),
    description: t('product_description', { name: title }),
  };
}
export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
