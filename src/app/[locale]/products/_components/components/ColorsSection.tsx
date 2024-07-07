import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import { FaAngleUp } from 'react-icons/fa6';
type Props = {
  name: string;
  label?: string;
  data: {
    [key: string]: string;
  };
};
function ColorsSection({ name, data }: Props) {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const [createQueryString, removeValueQueryString] = useQueryString();
  const [viewMore, setViewMore] = useState(false);
  const convertData = useMemo(() => {
    return Object.entries(data)?.map(([key, value]) => {
      return {
        id: key,
        value: value,
      };
    });
  }, [data]);
  const renderedColors = useMemo(() => {
    return convertData?.map((d) => {
      return (
        <li className='h-max' key={d.id}>
          <button
            className={`font-bold hover:text-red-500 ${
              searchParams.get(name) === d.id.toString() ? 'text-red-500' : ''
            } transition-colors`}
            onClick={() => createQueryString(name, d.id)}
          >
            {d.value}
          </button>
        </li>
      );
    });
  }, [convertData, createQueryString, searchParams, name]);
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-xl md:text-2xl font-bold uppercase'>{t('colors')}</h2>
      <ul
        style={{
          height: viewMore ? `${36 * convertData.length + 36}px` : '256px',
        }}
        className='flex flex-col gap-3 overflow-hidden transition-all duration-200'
      >
        <li className='h-max'>
          <button
            className={`font-bold hover:text-red-500 ${
              !searchParams.get(name) ? 'text-red-500' : ''
            } transition-colors`}
            onClick={() => removeValueQueryString(name)}
          >
            {t('all')}
          </button>
        </li>
        {renderedColors}
      </ul>
      <span className='w-full h-[2px] bg-red-500'></span>
      <button
        className='w-max font-bold flex justify-between items-center gap-4'
        onClick={() => setViewMore(!viewMore)}
      >
        <span>{t('view-more')}</span>
        <FaAngleUp
          className={`${
            viewMore ? 'rotate-0' : 'rotate-180'
          } transition-all duration-100`}
        />
      </button>
    </div>
  );
}

export default ColorsSection;
