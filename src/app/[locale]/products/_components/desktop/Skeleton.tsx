import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
import React from 'react';
export const SkeletonCategory = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='w-4/5 h-[42px] skeleton'></div>
      <div className='w-full flex flex-col gap-4'>
        <LoadingMultiItem customClass='w-3/5 h-[28px] skeleton' number={8} />
      </div>
    </div>
  );
};
export const SkeletonProduct = () => {
  return (
    <div className='flex flex-col items-center gap-16'>
      <div className='w-full grid grid-cols-4 gap-x-4 gap-y-16'>
        <LoadingMultiItem
          customClass='col-span-1 m-auto md:m-0 w-full w-[280px] h-[300px] skeleton'
          number={12}
        />
      </div>
    </div>
  );
};
