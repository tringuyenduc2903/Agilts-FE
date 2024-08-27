import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '2FA',
    description: 'Xác thực 2 bước',
  };
}
export default async function TwoFactorQrCodeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
