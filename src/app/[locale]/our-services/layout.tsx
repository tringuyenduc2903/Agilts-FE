import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Dịch vụ',
  description: 'Dịch vụ của Agilts',
};
export default async function OurServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
