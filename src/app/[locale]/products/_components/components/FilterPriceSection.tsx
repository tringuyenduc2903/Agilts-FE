import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import RangeSlider from '@/components/ui/RangeSlider';
import useQueryString from '@/lib/hooks/useQueryString';

function FilterPriceSection() {
  const t = useTranslations('common');
  const [isHoverFilterPrice, setIsHoverFilterPrice] = useState(false);
  const [createQueryString] = useQueryString();
  const [priceMin, setPriceMin] = useState<string | number>(0);
  const [priceMax, setPriceMax] = useState<string | number>(0);
  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-xl md:text-2xl font-bold uppercase'>
        {t('filter_title')}
      </h2>
      <RangeSlider
        min={0}
        max={100000000}
        onChange={({ min, max }) => {
          setPriceMin(min);
          setPriceMax(max);
        }}
      />
      <button
        className='relative w-max sm:w-[156px] h-[36px] sm:h-[46px] md:h-[55px] uppercase bg-red-500 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center text-sm'
        type='button'
        onMouseEnter={() => setIsHoverFilterPrice(true)}
        onMouseLeave={() => setIsHoverFilterPrice(false)}
        onClick={() =>
          createQueryString(
            ['priceMin', 'priceMax'],
            [priceMin.toString(), priceMax.toString()]
          )
        }
      >
        <span
          className={`w-[76px] sm:absolute sm:top-1/2 sm:left-4 sm:-translate-y-1/2 ${
            isHoverFilterPrice ? 'sm:translate-x-[40%]' : 'sm:translate-x-0'
          } px-2 z-10 bg-red-500 transition-all duration-200`}
        >
          {t('filter')}
        </span>
        <span className='w-full hidden sm:flex items-center'>
          <span className='w-full h-[1px] bg-white'></span>
          <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
        </span>
      </button>
    </div>
  );
}

export default FilterPriceSection;
