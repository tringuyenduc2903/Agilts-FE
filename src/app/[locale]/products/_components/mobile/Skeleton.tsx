import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
import React from 'react';

function ProductSkeleton() {
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='w-full flex flex-wrap justify-between gap-x-4 gap-y-8'>
        <LoadingMultiItem
          customClass='m-auto md:m-0 w-full h-[180px] md:h-[220px] max-w-[180px] md:max-w-[250px] gap-2 skeleton'
          number={12}
        />
      </div>
    </div>
  );
}

export default ProductSkeleton;
