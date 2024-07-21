import RangeSlider from '@/components/ui/RangeSlider';
import useQueryString from '@/lib/hooks/useQueryString';
import { convertData } from '@/lib/utils/format';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';

type Props = {
  action: string | null;
  models: {
    name: string;
    data: {
      [key: string]: string;
    };
  };
  colors: {
    name: string;
    data: {
      [key: string]: string;
    };
  };
  minPrice: number | string;
  maxPrice: number | string;
  closeSection: () => void;
};

function FilterSection({
  action,
  models,
  colors,
  minPrice,
  maxPrice,
  closeSection,
}: Props) {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const [createQueryString] = useQueryString();
  const [priceMin, setPriceMin] = useState<string | number>(0);
  const [priceMax, setPriceMax] = useState<string | number>(0);
  const renderedModels = useMemo(() => {
    return convertData(models?.data)?.map((d) => {
      return (
        <li className='h-max' key={d.id}>
          <button
            className={`font-bold text-sm md:text-base text-neutral-500 hover:text-red-500 ${
              searchParams.get(models.name) === d.id.toString()
                ? 'text-red-500'
                : ''
            } transition-colors`}
            onClick={() => {
              closeSection();
              createQueryString(models.name, d.id);
            }}
          >
            {d.value}
          </button>
        </li>
      );
    });
  }, [models, searchParams, createQueryString]);

  const renderedColors = useMemo(() => {
    return convertData(colors?.data)?.map((d) => {
      return (
        <li className='h-max w-full' key={d.id}>
          <button
            className={`w-full font-bold text-sm border border-neutral-300 rounded-sm px-4 py-1 hover:text-red-500 hover:border-red-500 ${
              searchParams.get(colors.name) === d.id.toString()
                ? 'text-red-500 border-red-500 '
                : ''
            } transition-colors`}
            onClick={() => {
              closeSection();
              createQueryString(colors.name, d.id);
            }}
          >
            {d.value}
          </button>
        </li>
      );
    });
  }, [colors, searchParams, createQueryString]);

  return (
    <div
      className={`absolute bg-white top-[125%] w-[70vw] max-h-screen z-50 overflow-x-hidden overflow-y-auto ${
        action === 'filter' ? 'h-[auto] border border-neutral-500' : 'h-0'
      }`}
    >
      <div className='w-full h-full px-6 py-8 flex justify-between gap-16'>
        <div className='w-1/5 flex flex-col gap-8'>
          <h2 className='text-lg md:text-xl font-bold'>{t('models')}</h2>
          <ul className='flex flex-col gap-2'>{renderedModels}</ul>
        </div>
        <div className='w-2/5 flex flex-col gap-8'>
          <h3 className='text-lg md:text-xl font-bold'>{t('colors')}</h3>
          <ul className='grid grid-cols-3 gap-4'>{renderedColors}</ul>
        </div>
        <div className='w-2/5 flex flex-col gap-8'>
          <h3 className='text-lg md:text-xl font-bold'>{t('price')}</h3>
          <RangeSlider
            min={Number(minPrice)}
            max={Number(maxPrice)}
            onChange={({ min, max }) => {
              setPriceMin(min);
              setPriceMax(max);
            }}
          />
          <button
            className='relative group w-max sm:w-[156px] h-[36px] sm:h-[46px] md:h-[55px] uppercase bg-red-500 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center text-sm'
            type='button'
            onClick={() => {
              closeSection();
              createQueryString(
                ['minPrice', 'maxPrice'],
                [priceMin.toString(), priceMax.toString()]
              );
            }}
          >
            <span className='w-[76px] sm:absolute sm:top-1/2 sm:left-4 sm:-translate-y-1/2 sm:translate-x-0 group-hover:sm:translate-x-[40%] px-2 z-10 bg-red-500 transition-all duration-200'>
              {t('filter')}
            </span>
            <span className='w-full hidden sm:flex items-center'>
              <span className='w-full h-[1px] bg-white'></span>
              <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterSection;
