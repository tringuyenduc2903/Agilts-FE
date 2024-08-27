import { title } from '@/config/config';
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dịch vụ',
    description: `Các dịch vụ của ${title}`,
  };
}
export default async function OurServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
