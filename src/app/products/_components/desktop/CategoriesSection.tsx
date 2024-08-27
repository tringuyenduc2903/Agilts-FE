'use client';
import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const [createQueryString, removeValueQueryString] = useQueryString();
  const renderedCategories = useMemo(() => {
    return convertData(data)?.map((d) => {
      return (
        <li className='h-max' key={d.id}>
          <button
            className={`font-bold hover:text-red-500 py-2 px-6 border ${
              searchParams.get(name) === d.id.toString()
                ? 'text-red-500 border-red-500'
                : 'border-neutral-500'
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
    <div className='w-full flex flex-col gap-4 border border-neutral-300 rounded-sm p-4'>
      <h1 className='text-xl md:text-2xl'>Danh mục</h1>
      <ul className='w-full h-auto flex justify-center items-center gap-4'>
        <li className='h-max'>
          <button
            className={`font-bold hover:text-red-500 py-2 px-6 border ${
              !searchParams.get(name)
                ? 'text-red-500 border-red-500'
                : 'border-neutral-500'
            } transition-colors`}
            onClick={() => removeValueQueryString(name)}
          >
            Tất cả
          </button>
        </li>
        {renderedCategories}
      </ul>
    </div>
  );
}
