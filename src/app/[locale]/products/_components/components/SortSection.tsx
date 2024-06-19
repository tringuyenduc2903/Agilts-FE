import React, { useCallback, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';
import useQueryString from '@/lib/hooks/useQueryString';

function SortSection() {
  const t = useTranslations('common');
  const [isSortDropdown, setIsSortDropdown] = useState(false);
  const [createQueryString, removeValueQueryString] = useQueryString();
  const [curSort, setCurSort] = useState({
    name: 'default_sorting',
    value: 'default',
  });
  const handleSelectedSort = useCallback(
    (name: string, value: string) => {
      setCurSort({ name, value });
      if (value === 'default') {
        removeValueQueryString('sort');
      } else {
        createQueryString('sort', value);
      }
      setIsSortDropdown(false);
    },
    [curSort, isSortDropdown, createQueryString, removeValueQueryString]
  );
  return (
    <div className='relative w-full lg:w-[360px] flex-col items-center'>
      <button
        className='sm:m-0 w-full h-[56px] flex items-stretch uppercase font-bold border border-neutral-200 rounded overflow-hidden'
        onClick={() => setIsSortDropdown((prevState) => !prevState)}
      >
        <span className='w-full h-full px-4 flex justify-start items-center tracking-[2px] text-sm'>
          {t('sort')}: {t(`${curSort?.name}`)}
        </span>
        <span className='h-full px-4 bg-red-500'>
          <FaAngleDown className='h-full text-white' />
        </span>
      </button>
      <div
        className={`absolute top-[110%] z-20 bg-white w-full lg:w-[360px] h-max py-2 ${
          isSortDropdown ? 'flex' : 'hidden'
        } border border-neutral-200 flex-col`}
      >
        <button
          className='text-start text-sm px-4 py-1 uppercase font-bold tracking-[2px] hover:text-red-500 transition-colors'
          onClick={() => handleSelectedSort('default_sorting', 'default')}
        >
          {t('default_sorting')}
        </button>
        <button
          className='text-start text-sm px-4 py-1 uppercase font-bold tracking-[2px] hover:text-red-500 transition-colors'
          onClick={() => handleSelectedSort('sort_by_popularity', 'popularity')}
        >
          {t('sort_by_popularity')}
        </button>
        <button
          className='text-start text-sm px-4 py-1 uppercase font-bold tracking-[2px] hover:text-red-500 transition-colors'
          onClick={() =>
            handleSelectedSort('sort_by_average_rating', 'average_rating')
          }
        >
          {t('sort_by_average_rating')}
        </button>
        <button
          className='text-start text-sm px-4 py-1 uppercase font-bold tracking-[2px] hover:text-red-500 transition-colors'
          onClick={() => handleSelectedSort('sort_by_latest', 'latest')}
        >
          {t('sort_by_latest')}
        </button>
        <button
          className='text-start text-sm px-4 py-1 uppercase font-bold tracking-[2px] hover:text-red-500 transition-colors'
          onClick={() => handleSelectedSort('sort_by_price_low', 'low_to_high')}
        >
          {t('sort_by_price_low')}
        </button>
        <button
          className='text-start text-sm px-4 py-1 uppercase font-bold tracking-[2px] hover:text-red-500 transition-colors'
          onClick={() =>
            handleSelectedSort('sort_by_price_high', 'high_to_low')
          }
        >
          {t('sort_by_price_high')}
        </button>
      </div>
    </div>
  );
}

export default SortSection;
