import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Aside from './_components/aside';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('head');

  return {
    title: t('settings_title'),
    description: t('settings_description'),
  };
}
export default async function SettingsLayout({
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
        <main className='w-full p-4'>{children}</main>
      </div>
    </>
  );
}
