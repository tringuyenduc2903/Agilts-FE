import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '2FA',
    description: '2FA',
  };
}
export default async function TwoFactorQrCodeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
