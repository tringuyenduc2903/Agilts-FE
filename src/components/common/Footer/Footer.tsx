'use client';
import { title } from '@/config/config';
import { useGetSettingsQuery } from '@/lib/redux/query/adminQuery';
import {
  FooterBranch,
  FooterPage,
  FooterService,
  FooterTime,
} from '@/types/types';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { FaLocationDot, FaPhone } from 'react-icons/fa6';
function Footer() {
  const { data, isFetching, isSuccess } = useGetSettingsQuery('footer');
  const formatData = useMemo(() => {
    return isSuccess && data
      ? data.reduce((acc: {}, curValue: FooterPage) => {
          return { ...acc, [curValue.key]: curValue };
        }, {})
      : null;
  }, [isSuccess, data]);
  return (
    <footer className='relative z-10'>
      {isFetching && (
        <section className='bg-neutral-900 py-16 px-4 lg:px-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-16'>
            <div className='col-span-1 flex flex-col gap-4'>
              <div className='w-full h-[32px] skeleton'></div>
              <div className='w-full h-[120px] skeleton'></div>
            </div>
            <div className='col-span-1 flex flex-col gap-4'>
              <div className='w-[1/2] h-[32px] skeleton'></div>
              <div className='flex flex-col gap-2'>
                <div className='w-1/2 h-[24px] skeleton'></div>
                <div className='w-1/2 h-[24px] skeleton'></div>
              </div>
            </div>
            <div className='col-span-1 flex flex-col gap-4'>
              <div className='w-[1/2] h-[32px] skeleton'></div>
              <div className='flex flex-col gap-2'>
                <div className='w-1/3 h-[24px] skeleton'></div>
                <div className='w-1/3 h-[24px] skeleton'></div>
              </div>
            </div>
            <div className='col-span-1 flex flex-col gap-4'>
              <div className='w-[1/2] h-[32px] skeleton'></div>
              <div className='flex flex-col gap-2'>
                <div className='w-3/4 h-[24px] skeleton'></div>
                <div className='w-3/4 h-[24px] skeleton'></div>
              </div>
            </div>
          </div>
        </section>
      )}
      {!isFetching && isSuccess && (
        <section className='bg-neutral-900 py-16 px-4 lg:px-16'>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-16'>
            <div className='col-span-1 flex flex-col gap-4'>
              <p className='text-white font-bold text-xl md:text-2xl tracking-[2px] md:tracking-[4px] uppercase'>
                Về {title}
              </p>
              <p className='text-neutral-400 text-sm md:text-base'>
                {formatData?.footer_about?.value?.description}
              </p>
            </div>
            <div className='col-span-1 flex flex-col gap-4'>
              <p className='text-white font-bold text-xl md:text-2xl tracking-[2px] md:tracking-[4px] uppercase'>
                Giờ hành chính
              </p>
              <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                {(formatData?.footer_about?.value?.time as FooterTime[])?.map(
                  (v) => {
                    return (
                      <li key={v?.title}>
                        {v?.title}: {v?.description}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
            <div className='col-span-1 flex flex-col gap-4'>
              <p className='text-white font-bold text-xl md:text-2xl tracking-[2px] md:tracking-[4px] uppercase'>
                Dịch vụ
              </p>
              <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                {(formatData?.footer_services?.value as FooterService[])?.map(
                  (s) => {
                    return (
                      <li key={s.title}>
                        <Link
                          href={`/${s.link}`}
                          className='hover:text-red-600 transition-colors'
                        >
                          {s.title}
                        </Link>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
            <div className='col-span-1 flex flex-col gap-4'>
              <p className='text-white font-bold text-xl md:text-2xl tracking-[2px] md:tracking-[4px] uppercase'>
                Chi nhánh
              </p>
              <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                <li>
                  <div className='flex gap-4'>
                    <div>
                      <FaLocationDot className='text-white text-lg sm:text-xl' />
                    </div>
                    <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                      <li>
                        <button className='hover:text-red-600 transition-colors text-start'>
                          {
                            (formatData?.footer_branch?.value as FooterBranch)
                              ?.address?.address_preview
                          }
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <div className='flex gap-4'>
                    <div>
                      <FaPhone className='text-white text-lg sm:text-xl' />
                    </div>
                    <ul className='text-neutral-400 text-sm sm:text-base md:text-lg flex flex-col gap-2'>
                      <li>
                        <a
                          href={`tel:${
                            (formatData?.footer_branch?.value as FooterBranch)
                              ?.phone_number
                          }`}
                          className='hover:text-red-600 transition-colors text-start'
                        >
                          {
                            (formatData?.footer_branch?.value as FooterBranch)
                              ?.phone_number
                          }
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
      {/* <section className='bg-neutral-950 py-8'>
        <p className='text-neutral-300 text-sm text-center'>
          © 2019 QODE INTERACTIVE, ALL RIGHTS RESERVED
        </p>
      </section> */}
    </footer>
  );
}

export default Footer;
