import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Sản phẩm',
    description: 'Các dòng xe máy của Agilts',
  };
}
export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}