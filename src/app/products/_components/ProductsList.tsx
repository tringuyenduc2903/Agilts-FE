'use client';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDown } from 'react-icons/fa6';
// type SelectedSort = {
//   name:
//     | 'Default sorting'
//     | 'Sort by popularity'
//     | 'Sort by average rating'
//     | 'Sort by latest'
//     | 'Sort by price: low to high'
//     | 'Sort by price: high to low';
//   value:
//     | 'default'
//     | 'popularity'
//     | 'average_rating'
//     | 'latest'
//     | 'low_to_high'
//     | 'high_to_low';
// };
function ProductsList() {
  const { t } = useTranslation('common');
  const [searchFocus, setSearchFocus] = useState(false);
  const [isSortDropdown, setIsSortDropdown] = useState(false);
  const [curSort, setCurSort] = useState({
    name: 'default_sorting',
    value: 'default',
  });
  const handleSelectedSort = useCallback((name: string, value: string) => {
    setCurSort({ name, value });
    setIsSortDropdown(false);
  }, []);
  return (
    <section className='py-16'>
      <div className='container m-auto px-4 flex flex-col lg:flex-row justify-between gap-4'>
        <h3 className='text-center lg:text-start font-bold tracking-[2px]'>
          {t('showing')} 1–12 {t('of')} 21 {t('results')}
        </h3>
        <div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-8'>
          <div className='relative w-[280px] lg:w-[360px] flex-col items-center'>
            <button
              className='m-auto sm:m-0 w-full h-[56px] flex items-stretch uppercase font-bold border border-neutral-200 rounded overflow-hidden'
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
              className={`w-[280px] lg:w-[360px] h-max py-2 ${
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
                onClick={() =>
                  handleSelectedSort('sort_by_popularity', 'popularity')
                }
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
                onClick={() =>
                  handleSelectedSort('sort_by_price_low', 'low_to_high')
                }
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
          <div>
            <div
              className={`m-auto sm:m-0 w-[280px] lg:w-[300px] h-[56px] flex items-stretch uppercase font-bold border ${
                searchFocus ? 'border-red-500' : 'border-neutral-200'
              } transition-colors rounded overflow-hidden`}
            >
              <input
                type='text'
                className='w-full h-full px-4 flex justify-start items-center tracking-[2px] uppercase text-sm'
                placeholder={`${t('your_search')}...`}
                onFocus={() => setSearchFocus(true)}
                onBlur={() => setSearchFocus(false)}
              />
              <span className='h-full px-4 bg-red-500'>
                <FaAngleDown className='h-full text-white' />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsList;
