import { Metadata } from 'next';
import Aside from './_components/aside';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Tài khoản',
    description: 'Quản lý đơn mua và địa chỉ',
  };
}
export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='px-4 min-h-[60vh] w-full md:w-4/5 2xl:w-3/5 pt-[72px] m-auto flex flex-col lg:flex-row text-sm md:text-base'>
        <Aside />
        <main className='flex-1 p-4'>{children}</main>
      </div>
    </>
  );
}
