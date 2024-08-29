import { getProductDetails } from '@/api/product';
import { Params } from '@/types/types';
import { notFound } from 'next/navigation';
import React from 'react';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {};
const Aside = dynamic(() => import('../../_components/product-details/aside'), {
  ssr: false,
});
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
const Description = dynamic(
  () => import('../../_components/product-details/description'),
  {
    ssr: false,
    loading: () => (
      <section className='container md:m-auto px-6 md:px-0 flex flex-col gap-4 w-full'>
        <div className='w-[250px] h-[32px] skeleton'></div>
        <div className='w-full h-[480px] skeleton'></div>
      </section>
    ),
  }
);
const Specifications = dynamic(
  () => import('../../_components/product-details/specifications'),
  {
    ssr: false,
    loading: () => (
      <section className='container md:m-auto px-6 md:px-0 w-full flex flex-col gap-4'>
        <div className='w-[250px] h-[32px] skeleton'></div>
        <div className='w-full h-[480px] skeleton'></div>
      </section>
    ),
  }
);
const Videos = dynamic(
  () => import('../../_components/product-details/videos'),
  {
    ssr: false,

    loading: () => (
      <section className='container md:m-auto px-6 md:px-0 w-full flex flex-col gap-4'>
        <div className='w-[250px] h-[32px] skeleton'></div>
        <div className='w-full h-[480px] skeleton'></div>
      </section>
    ),
  }
);
const Reviews = dynamic(
  () => import('../../_components/product-details/reviews'),
  {
    ssr: false,
    loading: () => (
      <section className='container md:m-auto px-6 md:px-0 w-full flex flex-col gap-4'>
        <div className='w-[250px] h-[32px] skeleton'></div>
        <div className='w-full h-[480px] skeleton'></div>
      </section>
    ),
  }
);
export default async function ProductDetailsPage({
  params,
}: {
  params: Params;
}) {
  const repo = await getProductDetails(params.id, 'motor-cycle');
  if (repo.type === 'error') return notFound();
  metadata.robots = { index: true, follow: true };
  metadata.title = repo.data.seo.title;
  metadata.keywords = repo.data.seo.title;
  metadata.openGraph = {
    siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
    type: 'website',
    url: `${process.env.NEXT_CLIENT_URL}/products/motor-cycle/${repo.data.search_url}`,
    images: [
      {
        url: repo.data.seo?.image,
      },
    ],
  };
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
            href='/products/motor-cycle'
          >
            Xe máy
          </Link>
          <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
          <p className='font-bold uppercase tracking-[2px]'>
            {repo?.data?.name}
          </p>
        </div>
      </section>
      <Aside product={repo?.data} />
      <ProductDetails product={repo?.data} />
      {repo?.data?.description && (
        <Description description={repo?.data?.description} />
      )}
      {repo?.data?.specifications?.length > 0 && (
        <Specifications specifications={repo?.data?.specifications} />
      )}
      {repo?.data?.videos.length > 0 && <Videos videos={repo?.data?.videos} />}
      {repo?.data?.reviews_avg_rate && repo?.data?.reviews_count && (
        <Reviews
          product_id={repo?.data?.id}
          reviews_avg_rate={repo?.data?.reviews_avg_rate}
          reviews_count={repo?.data?.reviews_count}
        />
      )}
    </main>
  );
}
