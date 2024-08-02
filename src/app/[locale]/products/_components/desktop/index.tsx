'use client';
import BreadCrumbs from '@/components/ui/BreadCrumbs';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  TbSearch,
  TbFilter,
  TbAlignJustified,
  TbFilterX,
} from 'react-icons/tb';
import CategoriesSection from './CategoriesSection';
import FilterSection from './FilterSection';
import ProductsSection from './ProductSection';
import { SkeletonCategory, SkeletonProduct } from './Skeleton';
import SortSection from './SortSection';
import useQueryString from '@/lib/hooks/useQueryString';
type Props = {
  filterData: any;
  isSuccessFilter: boolean;
  isLoadingFilter: boolean;
  isFetchingFilter: boolean;
  productsData: any;
  isSuccessProducts: boolean;
  isLoadingProducts: boolean;
  isFetchingProducts: boolean;
};
function ProductsDesktop({
  filterData,
  isSuccessFilter,
  isLoadingFilter,
  isFetchingFilter,
  productsData,
  isSuccessProducts,
  isLoadingProducts,
  isFetchingProducts,
}: Props) {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [createQueryString, removeValueQueryString, deleteQueryString] =
    useQueryString();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const handleSelectedAction = useCallback((action: string) => {
    setSelectedAction((prevAction) => {
      if (prevAction === action) return null;
      return action;
    });
  }, []);
  const handleResetSelectedAction = useCallback(() => {
    setSelectedAction(null);
  }, []);
  const handleSearch = useCallback(() => {
    if (inputRef.current) {
      if (inputRef.current.value) {
        createQueryString('search', inputRef.current.value);
      } else {
        removeValueQueryString('search');
      }
    }
  }, [inputRef.current]);
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && inputRef.current) {
        e.preventDefault();
        handleSearch();
      }
    },
    [createQueryString, removeValueQueryString, inputRef.current]
  );
  useLayoutEffect(() => {
    handleResetSelectedAction();
  }, [searchParams]);
  return (
    <>
      <BreadCrumbs path={`/${locale}/products`} />
      <section className='w-full min-h-screen py-16 m-auto px-4 md:px-8 xl:px-16 gap-16 overflow-hidden grid grid-cols-10'>
        <div className='col-span-2 rounded-sm border-r border-neutral-200 px-4'>
          {isSuccessFilter && !isLoadingFilter && !isFetchingFilter && (
            <CategoriesSection
              name={filterData[5]?.name as string}
              data={filterData[5]?.data}
            />
          )}
          {(isLoadingFilter || isFetchingFilter) && <SkeletonCategory />}
        </div>
        <div className='col-span-8 h-full flex flex-col gap-16'>
          <div className='w-full flex flex-col gap-4'>
            <div className='flex gap-4'>
              <div className='relative max-w-[260px] w-full border border-neutral-500 rounded-sm'>
                <input
                  ref={inputRef}
                  className='w-full h-full px-4 py-2'
                  type='text'
                  placeholder={t('search')}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='search-btn'
                  onClick={handleSearch}
                >
                  <TbSearch className='text-2xl' />
                </button>
              </div>
              <div className='relative max-w-[250px] w-full'>
                <button
                  className='w-full py-2 rounded-sm border border-neutral-500 flex justify-center items-center gap-2'
                  onClick={() => handleSelectedAction('filter')}
                >
                  <TbFilter className='text-2xl' />
                  <p className='text-lg font-bold'>{t('filter')}</p>
                </button>
                {isSuccessFilter && (
                  <FilterSection
                    action={selectedAction}
                    versions={filterData[4]}
                    colors={filterData[3]}
                    minPrice={filterData[1]?.data}
                    maxPrice={filterData[2]?.data}
                  />
                )}
              </div>
              <div className='relative max-w-[250px] w-full'>
                <button
                  className='w-full py-2 rounded-sm border border-neutral-500 flex justify-center items-center gap-2'
                  onClick={() => handleSelectedAction('sort')}
                >
                  <TbAlignJustified className='text-2xl' />
                  <p className='text-lg font-bold'>{t('sort')}</p>
                </button>
                <SortSection action={selectedAction} />
              </div>
              <div className='relative max-w-[250px] w-full'>
                <button
                  className='w-full py-2 bg-neutral-800 text-neutral-50 rounded-sm flex justify-center items-center gap-2'
                  onClick={() => deleteQueryString()}
                >
                  <TbFilterX className='text-2xl' />
                  <p className='text-lg font-bold'>{t('clear')}</p>
                </button>
              </div>
            </div>
            {!isFetchingProducts && productsData && (
              <div className='w-full flex justify-end'>
                {productsData?.total > 0 ? (
                  <h3 className='text-lg text-start font-bold tracking-[2px]'>
                    {t('showing')} {productsData?.from}-{productsData?.to}{' '}
                    {t('of')} {productsData?.total} {t('results')}
                  </h3>
                ) : (
                  <h3 className='text-lg text-start font-bold tracking-[2px]'>
                    {t('showing')} {productsData?.total} {t('result')}
                  </h3>
                )}
              </div>
            )}
          </div>
          {!isLoadingProducts &&
            !isFetchingProducts &&
            isSuccessProducts &&
            productsData?.data?.length > 0 && (
              <ProductsSection
                products={productsData?.data}
                total_pages={productsData?.total_pages}
                current_page={productsData?.current_page}
              />
            )}
          {(isLoadingProducts || isFetchingProducts) && <SkeletonProduct />}

          {!isLoadingProducts &&
            isSuccessProducts &&
            productsData?.data?.length === 0 && (
              <div className='w-full h-full flex justify-center items-center'>
                <p className='text-xl sm:text-2xl md:text-4xl font-bold'>
                  {t('mess_no_product')}
                </p>
              </div>
            )}
        </div>
      </section>
    </>
  );
}

export default ProductsDesktop;
