import { Metadata } from 'next';
export const metadata: Metadata = {
  title: '2FA',
  description: '2FA',
};
export default async function TwoFactorQrCodeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
