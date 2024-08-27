import { title } from '@/config/config';
import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '',
    description: '',
  };
}
export default async function AboutUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
