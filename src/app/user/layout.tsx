import { Metadata } from 'next';
import Aside from './_components/aside';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cài đặt',
    description: 'Cài đặt thông tin người dùng',
  };
}
export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='px-4 min-h-[60vh] w-full md:w-4/5 2xl:w-3/5 pt-[72px] m-auto flex flex-col lg:flex-row text-sm md:text-base'>
        <Aside />
        <main className='w-full p-4'>{children}</main>
      </div>
    </>
  );
}
