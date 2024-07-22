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

function ProductDetailsPage({
  params: { id, locale },
}: {
  params: {
    id: string;
    locale: string;
  };
}) {
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
          <ProductDetails product={productData} />
          <Description description={productData?.description} />
          <Specifications specifications={productData?.specifications} />
          {/* <Videos videos={productData?.videos} /> */}
          <Reviews
            reviews_avg_rate={productData?.reviews_avg_rate}
            reviews_count={productData?.reviews_count}
          />
        </>
      )}
    </main>
  );
}

export default ProductDetailsPage;
