import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description: 'Thông tin về Agilts',
};
export default async function AboutUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
