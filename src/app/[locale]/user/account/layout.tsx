import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Aside from './_components/aside';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('account_title'),
    description: t('account_description'),
  };
}
export default async function AccountLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale || 'vi');
  return (
    <>
      <div className='px-4 min-h-[60vh] w-full md:w-4/5 2xl:w-3/5 pt-[72px] m-auto flex flex-col lg:flex-row text-sm md:text-base'>
        <Aside />
        <main className='flex-1 p-4'>{children}</main>
      </div>
    </>
  );
}
