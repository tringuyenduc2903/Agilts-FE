import { getProductDetails } from '@/api/product';
import { Params } from '@/types/types';
import { notFound } from 'next/navigation';
import React from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const repo = await getProductDetails(params.id, 'square-parts');
  if (repo.type === 'error') return {};

  return {
    title: repo.data.seo.title,
    robots: { index: true, follow: true },
    keywords: repo.data.seo.title,
    openGraph: {
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      type: 'website',
      url: `${process.env.NEXT_CLIENT_URL}/products/square-parts/${repo.data.search_url}`,
      images: [
        {
          url: repo.data.seo?.image,
        },
      ],
    },
  };
}
const ProductDetails = dynamic(
  () => import('../../_components/product-details/productDetails'),
  {
    ssr: false,
    loading: () => (
      <section className='container md:m-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-2 gap-16 py-8 md:py-16 overflow-hidden'>
        <div className='col-span-1 w-full h-[550px] skeleton'></div>
        <div className='col-span-1 w-full h-[550px] skeleton'></div>
      </section>
    ),
  }
);
const ProductTab = dynamic(
  () => import('../../_components/product-details/productTab'),
  {
    ssr: false,
    loading: () => (
      <section className='container m-auto px-4 py-8 bg-neutral-100 flex flex-col gap-6'>
        <div className='flex justify-center items-center gap-8 bg-white py-4'>
          <div className='skeleton w-[52px] h-[24px]'></div>
          <div className='skeleton w-[52px] h-[24px]'></div>
          <div className='skeleton w-[52px] h-[24px]'></div>
          <div className='skeleton w-[52px] h-[24px]'></div>
        </div>
        <div className='w-full h-[40vh] skeleton'></div>
      </section>
    ),
  }
);
export default async function ProductDetailsPage({
  params,
}: {
  params: Params;
}) {
  const repo = await getProductDetails(params.id, 'square-parts');
  if (repo.type === 'error') return notFound();
  return (
    <main className='w-full min-h-screen py-[72px] flex flex-col gap-12 text-sm md:text-base'>
      <section className='bg-neutral-100 text-neutral-800'>
        <div className='py-6 container m-auto hidden md:flex flex-wrap items-center gap-4 text-base'>
          <Link
            className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
            href='/'
          >
            Trang chủ
          </Link>
          <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
          <Link
            className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
            href='/products/square-parts'
          >
            Phụ kiện
          </Link>
          <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
          <p className='font-bold uppercase tracking-[2px]'>
            {repo?.data?.name}
          </p>
        </div>
      </section>
      <ProductDetails product={repo?.data} />
      <ProductTab
        specifications={repo?.data?.specifications}
        description={repo?.data?.description}
        videos={repo?.data?.videos}
      />
    </main>
  );
}
