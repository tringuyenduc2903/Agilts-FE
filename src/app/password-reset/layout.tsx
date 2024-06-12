import { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Đặt lại mật khẩu',
    description: 'Đặt lại mật khẩu của bạn',
  };
}
export default async function ResetPasswordLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
