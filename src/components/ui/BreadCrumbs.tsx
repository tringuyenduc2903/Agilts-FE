'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
function BreadCrumbs() {
  const pathname = usePathname();
  const renderedBreadcrumbs = pathname
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
            {b}
          </Link>
        </div>
      );
    });
  return (
    <section className='bg-neutral-200 text-neutral-800'>
      <div className='container m-auto p-4 flex items-center gap-4 text-sm'>
        <Link
          className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
          href='/'
        >
          Home
        </Link>
        {renderedBreadcrumbs}
      </div>
    </section>
  );
}

export default BreadCrumbs;
