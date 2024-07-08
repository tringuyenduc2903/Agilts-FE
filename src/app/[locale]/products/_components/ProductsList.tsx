'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import SortSection from './components/SortSection';
import SearchSection from './components/SearchSection';
import FilterPriceSection from './components/FilterPriceSection';
import ProductsSection from './components/ProductsSection';
import CategoriesSection from './components/CategoriesSection';
import {
  useGetFilterQuery,
  useGetProductsQuery,
} from '@/lib/redux/query/storesQuery';
import { useSearchParams } from 'next/navigation';
import ColorsSection from './components/ColorsSection';
import ModelSection from './components/ModelSection';
import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
function ProductsList() {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const {
    data: filterData,
    isSuccess: isSuccessFilter,
    isLoading: isLoadingFilter,
  } = useGetFilterQuery(null);
  const {
    data: productsData,
    isSuccess: isSuccessProducts,
    isLoading: isLoadingProducts,
  } = useGetProductsQuery(searchParams.toString());
  return (
    <section className='py-16 flex flex-col gap-16'>
      <div className='container m-auto px-4 flex flex-col xl:flex-row justify-between gap-4'>
        {productsData?.total > 0 ? (
          <h3 className='text-start font-bold tracking-[2px]'>
            {t('showing')} {productsData?.from}-{productsData?.to} {t('of')}{' '}
            {productsData?.total} {t('results')}
          </h3>
        ) : (
          <h3 className='text-start font-bold tracking-[2px]'>
            {t('showing')} {productsData?.total} {t('result')}
          </h3>
        )}
        <div className='flex flex-col md:flex-row xl:items-center xl:justify-center gap-8'>
          <SortSection />
          <SearchSection />
        </div>
      </div>
      <div className='container m-auto px-4 grid grid-cols-1 xl:grid-cols-4 gap-16 overflow-hidden'>
        {!isLoadingProducts &&
          isSuccessProducts &&
          productsData?.data?.length > 0 && (
            <ProductsSection
              products={productsData?.data}
              total_pages={productsData?.total_pages}
              current_page={productsData?.current_page}
            />
          )}
        {!isLoadingProducts &&
          isSuccessProducts &&
          productsData?.data?.length === 0 && (
            <div className='col-span-1 xl:col-span-3 xl:order-1 order-2 flex justify-center'>
              <p className='my-8 text-xl sm:text-2xl md:text-4xl font-bold'>
                {t('mess_no_product')}
              </p>
            </div>
          )}
        {isLoadingProducts && (
          <div className='col-span-1 xl:col-span-3 xl:order-1 order-2 flex flex-col items-center gap-16'>
            <div className='w-full flex flex-wrap justify-between gap-x-4 gap-y-16'>
              <LoadingMultiItem customClass='w-full max-w-[300px] h-[350px] skeleton' />
            </div>
          </div>
        )}
        {!isLoadingFilter && isSuccessFilter && (
          <div className='col-span-1 xl:order-2 order-1 flex flex-col gap-8'>
            <FilterPriceSection
              minPrice={filterData[1]?.data}
              maxPrice={filterData[2]?.data}
            />
            <ModelSection
              name={filterData[4]?.name as string}
              label={filterData[4]?.label as string}
              data={filterData[4]?.data}
            />
            <CategoriesSection
              name={filterData[5]?.name as string}
              label={filterData[5]?.label as string}
              data={filterData[5]?.data}
            />
            <ColorsSection
              name={filterData[3]?.name as string}
              label={filterData[3]?.label as string}
              data={filterData[3]?.data}
            />
          </div>
        )}
        {isLoadingFilter && (
          <div className='col-span-1 xl:order-2 order-1 h-[620px] skeleton'></div>
        )}
      </div>
    </section>
  );
}

export default ProductsList;
