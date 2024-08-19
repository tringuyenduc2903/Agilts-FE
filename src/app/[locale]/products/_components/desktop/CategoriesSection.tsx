'use client';
import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useQueryString from '@/lib/hooks/useQueryString';
import { convertData } from '@/lib/utils/format';
type PropsFilter = {
  name: string;
  data: {
    [key: string]: string;
  };
  label: string;
};
export default function CategoriesSection({ name, data, label }: PropsFilter) {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const [createQueryString, removeValueQueryString] = useQueryString();
  const renderedCategories = useMemo(() => {
    return convertData(data)?.map((d) => {
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
  }, [data, createQueryString, searchParams, name]);
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-xl md:text-2xl font-bold uppercase border-b borer-neutral-300 pb-6'>
        {label}
      </h1>
      <ul className='h-auto flex flex-col gap-4'>
        <li className='h-max'>
          <button
            className={`font-bold text-base md:text-lg hover:text-red-500 ${
              !searchParams.get(name) ? 'text-red-500' : ''
            } transition-colors`}
            onClick={() => removeValueQueryString(name)}
          >
            {t('all')}
          </button>
        </li>
        {renderedCategories}
      </ul>
    </div>
  );
}
