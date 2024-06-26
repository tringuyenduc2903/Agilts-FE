'use client';
import CustomPaginationV2 from '@/components/ui/CustomPaginationV2';
import Stars from '@/components/ui/Stars';
import { useTranslations } from 'next-intl';
import React from 'react';

function Reviews() {
  const t = useTranslations('common');
  return (
    <section
      id='reviews'
      className='container md:m-auto px-6 md:px-0 flex flex-col gap-4'
    >
      <h2 className='text-xl md:text-2xl font-bold'>{t('reviews')} (4/5)</h2>
      <div className='py-8 px-4 sm:px-8 md:px-16 bg-neutral-100 flex flex-col gap-6 rounded-sm border-t-4 border-red-600'>
        <div className='flex flex-col gap-2'>
          <div className='flex'>
            <Stars rate={4} size={16} />
          </div>
          <div className='text-sm md:text-base flex flex-col sm:flex-row sm:items-center gap-2'>
            <p className='font-bold'>Tran Quan</p>
            <span className='hidden sm:block w-4 h-[1px] bg-neutral-800'></span>
            <p className='text-neutral-500'>September 3, 2019</p>
          </div>
          <p className='text-neutral-500 text-sm md:text-base'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
            voluptate laborum aperiam, molestias ea aspernatur obcaecati
            officiis? Eligendi quam fuga aspernatur, itaque, ea rerum cupiditate
            nam nostrum, alias mollitia possimus?
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex'>
            <Stars rate={4} size={16} />
          </div>
          <div className='text-sm md:text-base flex flex-col sm:flex-row sm:items-center gap-2'>
            <p className='font-bold'>Tran Quan</p>
            <span className='hidden sm:block w-4 h-[1px] bg-neutral-800'></span>
            <p className='text-neutral-500'>September 3, 2019</p>
          </div>
          <p className='text-neutral-500 text-sm md:text-base'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
            voluptate laborum aperiam, molestias ea aspernatur obcaecati
            officiis? Eligendi quam fuga aspernatur, itaque, ea rerum cupiditate
            nam nostrum, alias mollitia possimus?
          </p>
        </div>
        <div className='mt-4 flex justify-center items-center sm:justify-start'>
          <CustomPaginationV2 totalPage={100} />
        </div>
      </div>
    </section>
  );
}

export default Reviews;
