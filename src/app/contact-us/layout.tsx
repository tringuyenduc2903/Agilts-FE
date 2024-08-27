import { title } from '@/config/config';
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Liên hệ',
    description: `Liên hệ với ${title}`,
  };
}
export default async function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
