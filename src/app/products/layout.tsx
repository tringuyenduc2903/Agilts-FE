import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Các dòng xe máy của Agilts',
};
export default async function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
