'use client';
import React, { lazy, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useResponsive } from '@/lib/hooks/useResponsive';
import { useFetch } from '@/lib/hooks/useFetch';
import { getFilterProduct, getProducts } from '@/api/product';
const ProductsDesktop = lazy(() => import('../_components/desktop'));
const ProductsMobile = lazy(() => import('../_components/mobile'));
function AccessoriesLayout() {
  const searchParams = useSearchParams();
  const state = useResponsive();
  const {
    fetchData: getFilterProductMutation,
    data: filterData,
    isSuccess: isSuccessFilter,
    isLoading: isLoadingFilter,
  } = useFetch(
    async () => await getFilterProduct(searchParams.toString(), 'accessories')
  );
  const {
    fetchData: getProductMutation,
    data: productsData,
    isSuccess: isSuccessProducts,
    isLoading: isLoadingProducts,
  } = useFetch(
    async () => await getProducts(searchParams.toString(), 'accessories')
  );
  useEffect(() => {
    getFilterProductMutation();
  }, []);
  useEffect(() => {
    getProductMutation();
  }, [searchParams]);
  return (
    <main className='w-full min-h-screen pt-[72px] flex flex-col'>
      <Suspense>
        {state.isDesktop && (
          <ProductsDesktop
            filterData={filterData}
            isSuccessFilter={isSuccessFilter}
            isLoadingFilter={isLoadingFilter}
            productsData={productsData}
            isSuccessProducts={isSuccessProducts}
            isLoadingProducts={isLoadingProducts}
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

export default AccessoriesLayout;
