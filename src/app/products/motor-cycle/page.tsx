'use client';
import React, { lazy, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useResponsive } from '@/lib/hooks/useResponsive';
import {
  useGetFilterProductQuery,
  useGetProductsQuery,
} from '@/lib/redux/query/appQuery';
const ProductsDesktop = lazy(() => import('../_components/desktop'));
const ProductsMobile = lazy(() => import('../_components/mobile'));
function MotorCycleLayout() {
  const searchParams = useSearchParams();
  const state = useResponsive();
  const {
    data: filterData,
    isSuccess: isSuccessFilter,
    isFetching: isLoadingFilter,
  } = useGetFilterProductQuery('motor-cycle');
  const {
    data: productsData,
    isSuccess: isSuccessProducts,
    isFetching: isLoadingProducts,
  } = useGetProductsQuery({
    search: searchParams.toString(),
    perPage: 20,
    type: 'motor-cycle',
  });
  return (
    <main className='w-full min-h-screen pt-[72px] flex flex-col gap-8'>
      <Suspense>
        {state.isDesktop && (
          <ProductsDesktop
            filterData={filterData}
            isSuccessFilter={isSuccessFilter}
            isLoadingFilter={isLoadingFilter}
            productsData={productsData}
            isSuccessProducts={isSuccessProducts}
            isLoadingProducts={isLoadingProducts}
            page={'Xe máy'}
          />
        )}
        {state.isMobile && (
          <ProductsMobile
            filterData={filterData}
            isSuccessFilter={isSuccessFilter}
            productsData={productsData}
            isSuccessProducts={isSuccessProducts}
            isLoadingProducts={isLoadingProducts}
          />
        )}
      </Suspense>
    </main>
  );
}

export default MotorCycleLayout;
