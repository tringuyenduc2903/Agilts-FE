import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
import React from 'react';

function ProductSkeleton() {
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8'>
        <LoadingMultiItem
          customClass='col-span-1 m-auto md:m-0 w-full h-[180px] md:h-[220px] max-w-[180px] md:max-w-[250px] gap-2 skeleton'
          number={12}
        />
      </div>
    </div>
  );
}

export default ProductSkeleton;
