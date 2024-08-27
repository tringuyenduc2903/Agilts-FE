'use client';
import React from 'react';
import { Product } from '@/types/types';
import NotFoundItem from '@/components/ui/NotFoundItem';
type Props = {
  specifications: Product['specifications'];
};
function Specifications({ specifications }: Props) {
  return (
    <section
      id='specifications'
      className='container md:m-auto px-6 md:px-0 flex flex-col gap-4'
    >
      <h2 className='text-xl md:text-2xl font-bold'>Thông số kỹ thuật</h2>
      <div className='py-2 sm:py-4 md:py-8 px-4 sm:px-8 md:px-16 bg-neutral-100 flex flex-col rounded-sm border-t-4 border-red-600'>
        {specifications && specifications.length > 0 ? (
          specifications?.map((s, index: number) => {
            return (
              <div
                key={s?.key}
                className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm p-4 rounded-sm ${
                  index % 2 === 0 ? 'bg-white' : ''
                }`}
              >
                <p className='col-span-1 font-medium'>{s?.key}</p>
                <p
                  className='col-span-1 font-bold'
                  dangerouslySetInnerHTML={{ __html: s?.value }}
                ></p>
              </div>
            );
          })
        ) : (
          <NotFoundItem message='Sản phẩm hiện chưa có thông số kỹ thuật.'></NotFoundItem>
        )}
      </div>
    </section>
  );
}

export default Specifications;
