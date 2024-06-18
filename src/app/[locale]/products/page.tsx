import dynamic from 'next/dynamic';
import React from 'react';
const DynamicBreadCrumbs = dynamic(
  () => import('@/components/ui/BreadCrumbs'),
  {
    ssr: false,
    loading: () => <div className='skeleton w-full h-[68px]'></div>,
  }
);
const DynamicProducts = dynamic(() => import('./_components/ProductsList'));
function ProductsLayout() {
  return (
    <main className='w-full min-h-screen pt-[72px] flex flex-col'>
      <DynamicBreadCrumbs />
      <DynamicProducts />
    </main>
  );
}

export default ProductsLayout;
