import { title } from '@/config/config';
import { Metadata } from 'next';
import './_css/index.css';
export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: true, follow: true },
    title: 'Sản phẩm',
    description: `Các dòng xe máy của ${title}`,
  };
}
export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
