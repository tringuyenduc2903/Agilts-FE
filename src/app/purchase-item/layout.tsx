import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Đơn đặt hàng',
  };
}
export default async function PurchaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
