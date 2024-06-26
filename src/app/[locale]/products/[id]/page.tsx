import React from 'react';
import BreadCrumbs from '@/components/ui/BreadCrumbs';
import Specifications from './_components/specifications';
import ProductDetails from './_components/productDetails';
import Reviews from './_components/reviews';

function ProductDetailsPage({
  params: { id, locale },
}: {
  params: {
    id: string;
    locale: string;
  };
}) {
  return (
    <main className='w-full min-h-screen py-[72px] flex flex-col gap-8 text-sm md:text-base'>
      <BreadCrumbs path={`/${locale}/products`} details={id as string} />
      <ProductDetails />
      <Specifications />
      <Reviews />
    </main>
  );
}

export default ProductDetailsPage;
