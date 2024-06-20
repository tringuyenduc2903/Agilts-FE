'use client';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';
import { productsData } from '../_components/data';
import BreadCrumbs from '@/components/ui/BreadCrumbs';
import Image from 'next/image';

function ProductDetailsPage() {
  const { id } = useParams();
  const curProduct = useMemo(() => {
    return productsData.find((product) => product.id == id);
  }, [productsData]);
  console.log(curProduct);
  return (
    <main className='w-full min-h-screen pt-[72px] flex flex-col gap-8'>
      <BreadCrumbs />
      <section className='container m-auto grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div className='col-span-1 flex flex-col gap-6'>
          <Image
            className='max-h-[600px] w-full h-full object-cover border border-neutral-300 rounded-sm'
            src={curProduct?.img as string}
            alt={curProduct?.title as string}
          />
          <div className='flex justify-between items-center gap-6'>
            <Image
              className='max-w-[180px] max-h-[180px] w-full h-full object-cover border border-neutral-300 rounded-sm'
              src={curProduct?.img as string}
              alt={curProduct?.title as string}
            />
            <Image
              className='max-w-[180px] max-h-[180px] w-full h-full object-cover border border-neutral-300 rounded-sm'
              src={curProduct?.img as string}
              alt={curProduct?.title as string}
            />
            <Image
              className='max-w-[180px] max-h-[180px] w-full h-full object-cover border border-neutral-300 rounded-sm'
              src={curProduct?.img as string}
              alt={curProduct?.title as string}
            />
          </div>
        </div>
        <div className='col-span-1'>
          <h1 className='text-2xl md:text-4xl font-bold'>
            {curProduct?.title}
          </h1>
          <div>
            <p>{curProduct?.salePrice}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetailsPage;
