'use client';
import Image from 'next/image';
import demoimg from '@/assets/p4-title-area.jpg';
import { GiFullMotorcycleHelmet } from 'react-icons/gi';
import { useTranslations } from 'next-intl';
function OurServices() {
  const t = useTranslations('common');
  return (
    <main className='w-full pt-[72px] flex flex-col'>
      <section
        className='fixed h-[580px] w-full -z-[5] hidden lg:block'
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      ></section>
      <section className='fixed h-[580px] w-full -z-10 hidden lg:block'>
        <Image className='w-full h-full object-cover' src={demoimg} alt='' />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[580px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <h1 className='text-red-600 font-bold tracking-[8px]'>
          {t('performance')}
        </h1>
        <p className='text-4xl md:text-[70px] font-bold text-white tracking-[4px]'>
          {t('our-services')}
        </p>
      </section>
      <section className='bg-white px-4 py-16 md:py-32 w-full md:h-full flex flex-col gap-16 overflow-hidden'>
        <div className='relative md:w-1/2 m-auto flex flex-col md:flex-row justify-center items-center gap-4 md:gap-0'>
          <p className='order-2 md:order-1 w-full md:w-1/2 text-2xl md:text-[42px] leading-10 font-bold text-center md:text-end px-4 uppercase'>
            IMPROVE GENERAL RIDEABILITY
          </p>
          <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block w-[1px] h-full bg-neutral-600'></span>
          <p className='order-1 md:order-2 w-full md:w-1/2 text-sm md:text-base px-4 uppercase text-red-600 tracking-[8px] font-medium text-center md:text-start'>
            PERFORMANCE
          </p>
        </div>
        <div className='container m-auto h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
          <article className='col-span-1 flex flex-col gap-4 cursor-pointer'>
            <GiFullMotorcycleHelmet className='text-[70px] text-neutral-400' />
            <h2 className='text-2xl font-bold hover:text-red-500 transition-colors'>
              PROTETCION LINE
            </h2>
            <p className='text-neutral-600'>
              Etiam ultricies nisi vel augue, nulla ut me varius laoreet.
              Phasellus viverra nulla ut metus varius.
            </p>
          </article>
          <article className='col-span-1 flex flex-col gap-4 cursor-pointer'>
            <GiFullMotorcycleHelmet className='text-[70px] text-neutral-400' />
            <h2 className='text-2xl font-bold hover:text-red-500 transition-colors'>
              PROTETCION LINE
            </h2>
            <p className='text-neutral-600'>
              Etiam ultricies nisi vel augue, nulla ut me varius laoreet.
              Phasellus viverra nulla ut metus varius.
            </p>
          </article>
          <article className='col-span-1 flex flex-col gap-4 cursor-pointer'>
            <GiFullMotorcycleHelmet className='text-[70px] text-neutral-400' />
            <h2 className='text-2xl font-bold hover:text-red-500 transition-colors'>
              PROTETCION LINE
            </h2>
            <p className='text-neutral-600'>
              Etiam ultricies nisi vel augue, nulla ut me varius laoreet.
              Phasellus viverra nulla ut metus varius.
            </p>
          </article>
          <article className='col-span-1 flex flex-col gap-4 cursor-pointer'>
            <GiFullMotorcycleHelmet className='text-[70px] text-neutral-400' />
            <h2 className='text-2xl font-bold hover:text-red-500 transition-colors'>
              PROTETCION LINE
            </h2>
            <p className='text-neutral-600'>
              Etiam ultricies nisi vel augue, nulla ut me varius laoreet.
              Phasellus viverra nulla ut metus varius.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default OurServices;
