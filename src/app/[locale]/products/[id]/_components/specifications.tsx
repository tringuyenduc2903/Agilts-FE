'use client';
import React from 'react';
import { specifications } from '../data';
import { useTranslations } from 'next-intl';

function Specifications() {
  const t = useTranslations('common');
  return (
    <section className='container md:m-auto px-6 md:px-0 flex flex-col gap-4'>
      <h2 className='text-xl md:text-2xl font-bold'>{t('specifications')}</h2>
      <div className='py-2 sm:py-4 md:py-8 px-4 sm:px-8 md:px-16 bg-neutral-100 flex flex-col rounded-sm border-t-4 border-red-600'>
        {specifications?.map((s, index: number) => {
          return (
            <div
              key={s.name}
              className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm p-4 rounded-sm ${
                index % 2 === 0 ? 'bg-white' : ''
              }`}
            >
              <p className='col-span-1 font-medium'>{s.name}</p>
              <p
                className='col-span-1 font-bold'
                dangerouslySetInnerHTML={{ __html: s.value }}
              ></p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Specifications;
