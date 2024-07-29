'use client';
import React, { lazy, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  useGetFilterQuery,
  useGetProductsQuery,
} from '@/lib/redux/query/storesQuery';
import { useResponsive } from '@/lib/hooks/useResponsive';
const ProductsDesktop = lazy(() => import('./_components/desktop'));
const ProductsMobile = lazy(() => import('./_components/mobile'));
function ProductsLayout() {
  const searchParams = useSearchParams();
  const state = useResponsive();
  const {
    data: filterData,
    isSuccess: isSuccessFilter,
    isLoading: isLoadingFilter,
    isFetching: isFetchingFilter,
  } = useGetFilterQuery(null);
  const {
    data: productsData,
    isSuccess: isSuccessProducts,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useGetProductsQuery(searchParams.toString());
  return (
    <main className='w-full min-h-screen pt-[72px] flex flex-col'>
      <Suspense>
        {state.isDesktop && (
          <ProductsDesktop
            filterData={filterData}
            isSuccessFilter={isSuccessFilter}
            isLoadingFilter={isLoadingFilter}
            isFetchingFilter={isFetchingFilter}
            productsData={productsData}
            isSuccessProducts={isSuccessProducts}
            isLoadingProducts={isLoadingProducts}
            isFetchingProducts={isFetchingProducts}
          />
        )}
        {state.isMobile && (
          <ProductsMobile
            filterData={filterData}
            isSuccessFilter={isSuccessFilter}
            productsData={productsData}
            isSuccessProducts={isSuccessProducts}
            isLoadingProducts={isLoadingProducts}
            isFetchingProducts={isFetchingProducts}
          />
        )}
      </Suspense>
    </main>
  );
}

export default ProductsLayout;
