'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useTranslations } from 'next-intl';
import { getCookies } from 'cookies-next';
const BreadCrumbs = React.memo(() => {
  const t = useTranslations('common');
  const pathname = usePathname();
  const renderedBreadcrumbs = pathname
    .replace('/', '')
    .replace(`${getCookies()?.NEXT_LOCALE}`, '')
    .split('/')
    .map((b) => {
      return (
        <div className='flex items-center gap-4' key={b}>
          <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
          <Link
            className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
            href={`/${b}`}
          >
            {t(`${b}`)}
          </Link>
        </div>
      );
    });
  return (
    <section className='bg-neutral-100 text-neutral-800'>
      <div className='container m-auto px-4 py-6 flex items-center gap-4 text-sm'>
        <Link
          className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
          href='/'
        >
          {t('home')}
        </Link>
        {renderedBreadcrumbs}
      </div>
    </section>
  );
});
BreadCrumbs.displayName = 'BreadCrumbs';
export default BreadCrumbs;
