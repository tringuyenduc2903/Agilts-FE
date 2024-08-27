import { title } from '@/config/config';
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: true, follow: true },
    title: 'Cửa hàng',
    description: `Hệ thống cửa hàng ${title}`,
  };
}
export default async function StoresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
