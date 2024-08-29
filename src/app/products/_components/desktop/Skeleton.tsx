import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
import React from 'react';
export const SkeletonProduct = () => {
  return (
    <div className='w-full flex flex-col items-center gap-16'>
      <div className='w-full grid grid-cols-4 2xl:grid-cols-5 gap-16'>
        <LoadingMultiItem
          customClass='col-span-1 m-auto md:m-0 w-full w-full h-[350px] skeleton'
          number={20}
        />
      </div>
    </div>
  );
};
