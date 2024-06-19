import React, { useMemo } from 'react';
import { Tag } from '../data';
import { useTranslations } from 'next-intl';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
type Props = {
  tags: Tag[];
};
function TagsSection({ tags }: Props) {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const [createQueryString, removeValueQueryString] = useQueryString();
  const renderedTags = useMemo(() => {
    return tags?.map((t, index) => {
      return (
        <li className='w-max flex justify-between gap-3' key={t.slug}>
          <button
            className={`uppercase text-[12px] md:text-sm font-medium hover:text-red-500 ${
              searchParams.get('tag') === t.slug ? 'text-red-500' : ''
            } transition-colors`}
            onClick={() => createQueryString('tag', t.slug)}
          >
            {t?.title}
          </button>
          {index !== tags.length - 1 && (
            <div className='flex justify-center items-center'>
              <span className='relative w-4 h-[1px] bg-neutral-800'></span>
            </div>
          )}
        </li>
      );
    });
  }, [tags, createQueryString, searchParams]);
  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-xl md:text-2xl font-bold uppercase'>{t('tags')}</h2>
      <ul className={`flex flex-wrap gap-3 overflow-hidden`}>
        <li className='w-max flex justify-between gap-3'>
          <button
            className={`uppercase text-[12px] md:text-sm font-medium hover:text-red-500 ${
              !searchParams.get('tag') ? 'text-red-500' : ''
            } transition-colors`}
            onClick={() => removeValueQueryString('tag')}
          >
            {t('all')}
          </button>
          <div className='flex justify-center items-center'>
            <span className='relative w-4 h-[1px] bg-neutral-800'></span>
          </div>
        </li>
        {renderedTags}
      </ul>
    </div>
  );
}

export default TagsSection;
