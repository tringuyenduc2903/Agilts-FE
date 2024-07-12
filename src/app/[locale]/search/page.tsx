'use client';
import Image from 'next/image';
import React, { useCallback, useMemo, useRef } from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { useGetProductsQuery } from '@/lib/redux/query/storesQuery';
import CustomPagination from '@/components/ui/CustomPagination';
import { Product } from '@/types/types';
import { SingleProduct } from '@/components/ui/SingleProduct';
import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
function SearchPage() {
  const t = useTranslations('common');
  const { locale } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    data: productsData,
    isSuccess: isSuccessData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
  } = useGetProductsQuery(
    `page=${searchParams.get('page') || 1}&search=${searchParams.get(
      'q'
    )}&offset=12&visibility=Search`,
    {
      skip: !searchParams.get('q'),
    }
  );
  const handleSearch = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && inputRef.current) {
        e.preventDefault();
        router.push(`/${locale}/search?q=${inputRef.current?.value}`);
      }
    },
    [router, locale, inputRef]
  );
  const renderedProducts = useMemo(() => {
    return (
      (isSuccessData &&
        productsData?.data?.map((p: Product) => {
          return (
            <SingleProduct product={p}>
              <SingleProduct.Image />
              <div className='flex flex-col gap-1'>
                <SingleProduct.Category />
                <SingleProduct.Title />
                <SingleProduct.Price />
              </div>
            </SingleProduct>
          );
        })) ||
      []
    );
  }, [isSuccessData, productsData]);
  return (
    <main className='w-full py-[72px] flex flex-col gap-16'>
      <section className='absolute h-[280px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[280px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <p className='text-center md:text-start text-2xl sm:text-4xl font-black text-white lg:text-neutral-800 tracking-[2px]'>
          <span className='uppercase'>{t('search_results')}</span>:
          <span className='px-4'>{searchParams.get('q')}</span>
        </p>
      </section>
      <section className='container m-auto px-4 flex flex-col gap-4'>
        <label
          htmlFor='search'
          className='text-xl sm:text-2xl font-black text-neutral-800 uppercase'
        >
          {t('new_search')}:
        </label>
        <div className='relative w-full'>
          <input
            ref={inputRef}
            className='w-full font-bold py-2 border-b-2 border-neutral-300'
            id='search'
            type='text'
            placeholder={t('enter_search')}
            onKeyDown={handleSearch}
          />
          <button
            aria-label='search-btn'
            className='absolute top-1/2 -translate-y-1/2 right-0 text-neutral-500'
            onClick={() =>
              router.push(`/${locale}/search?q=${inputRef.current?.value}`)
            }
          >
            <FaSearch className='text-2xl' />
          </button>
        </div>
        <p className='text-sm text-neutral-500'>{t('mess_new_search')}</p>
      </section>
      <section className='container m-auto px-4 flex flex-col gap-6'>
        {isSuccessData && !isFetchingData && renderedProducts && (
          <p className='font-bold text-lg md:text-xl text-red-500'>
            {Number(productsData?.total) > 1
              ? t('mess_found_many', { number: productsData?.total })
              : t('mess_found_1', { number: productsData?.total })}
          </p>
        )}
        {!isLoadingData && !isFetchingData && renderedProducts && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16'>
            {renderedProducts}
          </div>
        )}
        {isLoadingData ||
          (isFetchingData && (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16'>
              <LoadingMultiItem
                customClass='h-[380px] w-full skeleton'
                number={12}
              />
            </div>
          ))}
        {!isLoadingData && renderedProducts?.length === 0 && (
          <div className='w-full h-[20vh] md:h-[40vh] flex justify-center items-center'>
            <p className='text-lg sm:text-2xl md:text-3xl font-black'>
              {t('no_search')}!
            </p>
          </div>
        )}
        {isSuccessData && Number(productsData.total_pages) > 1 && (
          <div className='w-full'>
            <CustomPagination
              curPage={Number(productsData.current_page)}
              totalPage={Number(productsData.total_pages)}
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchPage;
