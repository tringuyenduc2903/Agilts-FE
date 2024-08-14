'use client';
import { Product } from '@/types/types';
import { useTranslations } from 'next-intl';
import React from 'react';
type Props = {
  description: Product['description'];
};
function Description({ description }: Props) {
  const t = useTranslations('common');
  return (
    <section
      id='description'
      className='container md:m-auto px-6 md:px-0 flex flex-col gap-4'
    >
      <h2 className='text-xl md:text-2xl font-bold'>{t('description')}</h2>
      <div className='py-2 sm:py-4 md:py-8 px-4 sm:px-8 md:px-16 bg-neutral-100 flex flex-col rounded-sm border-t-4 border-red-600'>
        <div dangerouslySetInnerHTML={{ __html: description }}></div>
      </div>
    </section>
  );
}

export default Description;
