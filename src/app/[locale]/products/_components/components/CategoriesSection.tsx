import React, { useMemo, useState } from 'react';
import { Category } from '../data';
import { useTranslations } from 'next-intl';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import { FaAngleUp } from 'react-icons/fa6';
type Props = {
  categories: Category[];
};
function CategoriesSection({ categories }: Props) {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const [createQueryString, removeValueQueryString] = useQueryString();
  const [viewMore, setViewMore] = useState(false);
  const renderedCategories = useMemo(() => {
    return categories?.map((c) => {
      return (
        <li className='h-max' key={c.value}>
          <button
            className={`font-bold hover:text-red-500 ${
              searchParams.get('category') === c.value.toString()
                ? 'text-red-500'
                : ''
            } transition-colors`}
            onClick={() => createQueryString('category', c.value as string)}
          >
            {c.title}
          </button>
        </li>
      );
    });
  }, [categories, createQueryString, searchParams]);
  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-xl md:text-2xl font-bold uppercase'>
        {t('categories')}
      </h2>
      <ul
        style={{
          height: viewMore ? `${36 * categories.length + 36}px` : '128px',
        }}
        className='flex flex-col gap-3 overflow-hidden transition-all duration-200'
      >
        <li className='h-max'>
          <button
            className={`font-bold hover:text-red-500 ${
              !searchParams.get('category') ? 'text-red-500' : ''
            } transition-colors`}
            onClick={() => removeValueQueryString('category')}
          >
            {t('all')}
          </button>
        </li>
        {renderedCategories}
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

export default CategoriesSection;
