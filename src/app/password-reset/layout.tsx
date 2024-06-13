import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
  description: 'Đặt lại mật khẩu của bạn',
};
export default async function ResetPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
