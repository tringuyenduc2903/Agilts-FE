'use client';
import { scrollToElement } from '@/lib/utils/scrollElement';
import { Product } from '@/types/types';
import React from 'react';

function Aside({ product }: { product: Product }) {
  return (
    <aside className='fixed w-max top-1/2 -translate-y-1/2 right-4 flex flex-col items-end gap-2 z-50'>
      {product?.description && (
        <button
          className='w-max px-6 py-1 bg-white text-red-500 border border-red-500 font-bold'
          onClick={() => scrollToElement('description')}
        >
          Mô tả
        </button>
      )}
      {product?.specifications?.length > 0 && (
        <button
          className='w-max px-6 py-1 bg-white text-red-500 border border-red-500 font-bold'
          onClick={() => scrollToElement('specifications')}
        >
          Thông số kỹ thuật
        </button>
      )}
      {product?.videos.length > 0 && (
        <button
          className='w-max px-6 py-1 bg-white text-red-500 border border-red-500 font-bold rounded-tl-2xl rounded-bl-2xl'
          onClick={() => scrollToElement('Video')}
        >
          Video
        </button>
      )}
      {product?.reviews_avg_rate && product?.reviews_count && (
        <button
          className='px-6 py-1 bg-white text-red-500 border border-red-500 font-bold'
          onClick={() => scrollToElement('reviews')}
        >
          Đánh giá
        </button>
      )}
    </aside>
  );
}

export default Aside;
