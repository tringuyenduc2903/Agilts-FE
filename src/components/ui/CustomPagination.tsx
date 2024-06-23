import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';
type Props = {
  curPage?: number | string;
  totalPage: number;
};
function CustomPagination({ curPage, totalPage }: Props) {
  const [isHoverButton, setIsHoverButton] = useState<String | null>(null);
  const searchParams = useSearchParams();
  const [createQueryString] = useQueryString();
  const [pageValue, setPageValue] = useState<number | string>(
    () => searchParams.get('page') || 1
  );
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setPageValue((prevValue) => {
        if (Number(value) >= Number(totalPage)) return (prevValue = totalPage);
        if (Number(value) <= 1) return 1;
        return (prevValue = Number(value));
      });
    },
    [totalPage]
  );
  const handlePrev = useCallback(() => {
    if (Number(pageValue) <= 1) {
      setPageValue(1);
      createQueryString('page', '1');
    } else {
      setPageValue((prevValue) => Number(prevValue) - 1);
      createQueryString('page', (Number(pageValue) - 1).toString());
    }
  }, [pageValue, createQueryString]);
  const handleNext = useCallback(() => {
    if (Number(pageValue) >= Number(totalPage)) {
      setPageValue(totalPage);
      createQueryString('page', totalPage.toString());
    } else {
      setPageValue((prevValue) => Number(prevValue) + 1);
      createQueryString('page', (Number(pageValue) + 1).toString());
    }
  }, [pageValue, createQueryString, totalPage]);
  const handleKeypress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        createQueryString('page', pageValue.toString() as string);
      }
    },
    [createQueryString, pageValue]
  );
  return (
    <div className='flex justify-between items-center'>
      {Number(searchParams.get('page')) > 1 && (
        <button
          className='relative w-[96px] md:w-[200px] h-[60px] uppercase bg-white text-neutral-800 px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
          onMouseEnter={() => setIsHoverButton('prev')}
          onMouseLeave={() => setIsHoverButton(null)}
          onClick={handlePrev}
        >
          <span
            className={`hidden md:block absolute top-1/2 right-4 -translate-y-1/2 ${
              isHoverButton === 'prev' ? '-translate-x-[100%]' : 'translate-x-0'
            } px-4 z-10 transition-all duration-200 bg-white text-sm`}
          >
            Prev
          </span>
          <span className='w-full flex items-center'>
            <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[10px] border-r-neutral-700'></span>
            <span className='w-full h-[1px] bg-neutral-800'></span>
          </span>
          <span
            className={`absolute top-0 left-0 ${
              isHoverButton === 'prev' ? 'w-full' : 'w-[60px]'
            } transition-all duration-200 h-full border border-neutral-300`}
          ></span>
        </button>
      )}
      <div className='flex justify-center items-center w-max gap-2 font-bold'>
        <input
          className='w-[36px] text-center'
          type='number'
          maxLength={2}
          value={pageValue}
          onChange={handleInputChange}
          onKeyDown={handleKeypress}
        />
        <span>/</span>
        <p className='w-[36px] flex justify-center items-center'>{totalPage}</p>
      </div>
      {Number(searchParams.get('page')) < Number(totalPage) && (
        <button
          className='relative w-[96px] md:w-[200px] h-[60px] uppercase bg-white text-neutral-800 px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
          onMouseEnter={() => setIsHoverButton('next')}
          onMouseLeave={() => setIsHoverButton(null)}
          onClick={handleNext}
        >
          <span
            className={`hidden md:block absolute top-1/2 left-4 -translate-y-1/2 ${
              isHoverButton === 'next' ? 'translate-x-[95%]' : 'translate-x-0'
            } px-4 z-10 bg-white transition-all duration-200 text-sm`}
          >
            Next
          </span>
          <span className='w-full flex items-center'>
            <span className='w-full h-[1px] bg-neutral-800'></span>
            <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-neutral-700'></span>
          </span>
          <span
            className={`absolute top-0 right-0 ${
              isHoverButton === 'next' ? 'w-full' : 'w-[60px]'
            } transition-all duration-200 h-full border border-neutral-300`}
          ></span>
        </button>
      )}
    </div>
  );
}

export default CustomPagination;
