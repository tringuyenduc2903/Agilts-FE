import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Về chúng tôi',
    description: 'Thông tin về Agilts',
  };
}
export default async function AboutUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
