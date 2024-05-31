'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import notfound from '@/assets/error-img-1.png';
import Image from 'next/image';
function NotFound() {
  const { t } = useTranslation('common');
  const [isHoverButton, setIsHoverButton] = useState(false);
  const router = useRouter();
  return (
    <main className='m-auto pt-[72px] container h-[70vh] px-4'>
      <div className='relative w-full h-full flex items-center justify-center'>
        <section className='w-full lg:w-1/2 relative z-10 flex flex-col gap-4'>
          <h1 className='text-center lg:text-start sm:text-base md:text-lg text-red-600 tracking-[4px] md:tracking-[8px] uppercase font-bold'>
            {t('error-page')}
          </h1>
          <p className='text-center lg:text-start text-4xl md:text-6xl font-bold tracking-[4px] uppercase'>
            {t('page-not-found')}
          </p>
          <div className='text-sm sm:text-base md:text-lg text-neutral-500 flex flex-col gap-1'>
            <p className='text-center lg:text-start'>{t('error-page-mess1')}</p>
            <p className='text-center lg:text-start'>{t('error-page-mess2')}</p>
          </div>
          <button
            className='relative w-max m-auto lg:m-0 sm:w-[230px] h-[36px] sm:h-[46px] md:h-[55px] text-sm md:text-base uppercase bg-red-600 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
            onMouseEnter={() => setIsHoverButton(true)}
            onMouseLeave={() => setIsHoverButton(false)}
            onClick={() => router.replace('/')}
          >
            <span
              className={`w-[164px] sm:absolute sm:top-1/2 sm:left-4 sm:-translate-y-1/2 ${
                isHoverButton ? 'sm:translate-x-[10%]' : 'sm:translate-x-0'
              } px-4 z-10 bg-red-600 transition-all duration-200 text-sm`}
            >
              {t('back-home')}
            </span>
            <span className='w-full hidden sm:flex items-center'>
              <span className='w-full h-[1px] bg-white'></span>
              <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
            </span>
          </button>
        </section>
        <section className='absolute lg:relative lg:w-1/2'>
          <Image
            className='aspect-auto object-cover'
            src={notfound}
            alt='not-found-img'
          />
        </section>
      </div>
    </main>
  );
}

export default NotFound;
