'use client';
import React from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
function StoresPage() {
  const t = useTranslations('common');
  return (
    <main className='w-full py-[72px] flex flex-col gap-8'>
      <section className='absolute h-[500px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[500px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <h1 className='text-red-600 font-bold tracking-[8px]'>
          {t('performance')}
        </h1>
        <p className='text-2xl md:text-4xl md:text-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
          {t('stores')}
        </p>
      </section>
    </main>
  );
}

export default StoresPage;
