'use client';
import React from 'react';
import BreadCrumbs from '@/components/ui/BreadCrumbs';
import Specifications from './_components/specifications';
import ProductDetails from './_components/productDetails';
import Reviews from './_components/reviews';
import { useGetProductDetailsQuery } from '@/lib/redux/query/storesQuery';
import { notFound } from 'next/navigation';
import Videos from './_components/videos';
import Description from './_components/description';
import { useTranslations } from 'next-intl';
import { scrollToElement } from '@/lib/utils/scrollElement';

function ProductDetailsPage({
  params: { id, locale },
}: {
  params: {
    id: string;
    locale: string;
  };
}) {
  const t = useTranslations('common');
  const {
    data: productData,
    isSuccess: isSuccessProduct,
    isError: isErrorProduct,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useGetProductDetailsQuery(id);
  if (!isLoadingProduct && isErrorProduct) return notFound();
  return (
    <main className='w-full min-h-screen py-[72px] flex flex-col gap-12 text-sm md:text-base'>
      {(isLoadingProduct || isFetchingProduct) && (
        <>
          <section className='w-full h-[68px] skeleton'></section>
          <section className='container md:m-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-2 gap-16 py-8 md:py-16 overflow-hidden'>
            <div className='col-span-1 w-full h-[550px] skeleton'></div>
            <div className='col-span-1 w-full h-[550px] skeleton'></div>
          </section>
          <section className='container md:m-auto px-6 md:px-0 flex flex-col gap-4 w-full'>
            <div className='w-[250px] h-[32px] skeleton'></div>
            <div className='w-full h-[480px] skeleton'></div>
          </section>
          <section className='container md:m-auto px-6 md:px-0 w-full flex flex-col gap-4'>
            <div className='w-[250px] h-[32px] skeleton'></div>
            <div className='w-full h-[480px] skeleton'></div>
          </section>
          <section className='container md:m-auto px-6 md:px-0 w-full flex flex-col gap-4'>
            <div className='w-[250px] h-[32px] skeleton'></div>
            <div className='w-full h-[480px] skeleton'></div>
          </section>
          <section className='container md:m-auto px-6 md:px-0 w-full flex flex-col gap-4'>
            <div className='w-[250px] h-[32px] skeleton'></div>
            <div className='w-full h-[480px] skeleton'></div>
          </section>
        </>
      )}
      {!isLoadingProduct && !isFetchingProduct && isSuccessProduct && (
        <>
          <BreadCrumbs
            path={`/${locale}/products`}
            details={productData?.name}
          />
          <aside className='fixed w-max top-1/3 -translate-y-1/2 right-4 flex flex-col items-end gap-2'>
            {productData?.description && (
              <button
                className='w-max px-6 py-1 bg-white text-red-500 border border-red-500 font-bold'
                onClick={() => scrollToElement('description')}
              >
                {t('description')}
              </button>
            )}
            {productData?.specifications?.length > 0 && (
              <button
                className='w-max px-6 py-1 bg-white text-red-500 border border-red-500 font-bold'
                onClick={() => scrollToElement('specifications')}
              >
                {t('specifications')}
              </button>
            )}
            {productData?.videos.length > 0 && (
              <button
                className='w-max px-6 py-1 bg-white text-red-500 border border-red-500 font-bold rounded-tl-2xl rounded-bl-2xl'
                onClick={() => scrollToElement('Video')}
              >
                Video
              </button>
            )}
            {productData?.reviews_avg_rate && productData?.reviews_count && (
              <button
                className='px-6 py-1 bg-white text-red-500 border border-red-500 font-bold'
                onClick={() => scrollToElement('reviews')}
              >
                {t('reviews')}
              </button>
            )}
          </aside>
          <ProductDetails product={productData} />
          {productData?.description && (
            <Description description={productData?.description} />
          )}
          {productData?.specifications?.length > 0 && (
            <Specifications specifications={productData?.specifications} />
          )}
          {productData?.videos.length > 0 && (
            <Videos videos={productData?.videos} />
          )}
          {productData?.reviews_avg_rate && productData?.reviews_count && (
            <Reviews
              reviews_avg_rate={productData?.reviews_avg_rate}
              reviews_count={productData?.reviews_count}
            />
          )}
        </>
      )}
    </main>
  );
}

export default ProductDetailsPage;
