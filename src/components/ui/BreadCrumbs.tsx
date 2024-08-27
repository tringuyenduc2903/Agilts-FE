'use client';
import Link from 'next/link';
import React from 'react';

const BreadCrumbs = React.memo(
  ({ path, details }: { path: string; details?: string }) => {
    const formatPath = path.replace(``, '').replace('/', '').split('/');

    const renderedBreadcrumbs = formatPath.map((b, index) => {
      const fullPath = formatPath.slice(0, index + 1).join('/');
      return (
        <div className='flex items-center gap-4' key={b}>
          <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
          <Link
            className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
            href={`/${fullPath}`}
          >
            {b}
          </Link>
        </div>
      );
    });

    return (
      <section className='bg-neutral-100 text-neutral-800 hidden xl:block'>
        <div className='container m-auto px-4 py-6 flex flex-wrap items-center gap-4 text-[12px] md:text-sm'>
          <Link
            className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
            href={``}
          >
            Trang chủ
          </Link>
          {renderedBreadcrumbs}
          {details && (
            <div className='flex items-center gap-4'>
              <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
              <p
                title={details}
                className='max-w-[120px] md:max-w-full truncate font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors cursor-pointer'
              >
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
