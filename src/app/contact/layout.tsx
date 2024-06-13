import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ với Agilts',
};
export default async function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
