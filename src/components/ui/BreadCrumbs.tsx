'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';
import { useTranslations } from 'next-intl';
const BreadCrumbs = React.memo(
  ({ path, details }: { path: string; details?: string }) => {
    const { locale } = useParams();
    const t = useTranslations('common');
    const renderedBreadcrumbs = path
      .replace(`/${locale}`, '')
      .replace('/', '')
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
        <div className='container m-auto px-4 py-6 flex flex-wrap items-center gap-4 text-[12px] md:text-sm'>
          <Link
            className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
            href={`/${locale}`}
          >
            {t('home')}
          </Link>
          {renderedBreadcrumbs}
          {details && (
            <div className='flex items-center gap-4'>
              <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
              <p className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors cursor-pointer'>
                {details}
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }
);
BreadCrumbs.displayName = 'BreadCrumbs';
export default BreadCrumbs;
