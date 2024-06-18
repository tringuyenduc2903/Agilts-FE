import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('product_title'),
    description: t('product_description'),
  };
}
export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
