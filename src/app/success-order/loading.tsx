import React from 'react';

function Loading() {
  return (
    <div className='w-full py-[96px] px-4 flex justify-center items-center flex-col gap-6 sm:h-[60vh]'>
      <div className='size-[56px] md:size-[64px] rounded-full skeleton'></div>
      <div className='mx-auto w-[250px] h-[20px] md:h-[24px] skeleton'></div>
      <div className='w-full md:w-1/2 h-[32px] md:h-[64px] skeleton'></div>
      <div className='w-full flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6'>
        <div className='w-full sm:w-[242px] h-[38px] md:h-[50px] skeleton'></div>
        <div className='w-full sm:w-[242px] h-[38px] md:h-[50px] skeleton'></div>
      </div>
    </div>
  );
}

export default Loading;
