import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Liên hệ',
    description: 'Liên hệ với Agilts',
  };
}
export default async function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
