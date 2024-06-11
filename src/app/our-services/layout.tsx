import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dịch vụ',
    description: 'Dịch vụ của Agilts',
  };
}
export default async function OurServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
