import useQueryString from '@/lib/hooks/useQueryString';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
type Props = {
  action: string | null;
  closeSection: () => void;
};
function SortSection({ action, closeSection }: Props) {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const [createQueryString] = useQueryString();
  return (
    <div
      className={`absolute bg-white top-[125%] w-[15vw] max-h-screen z-50 overflow-x-hidden overflow-y-auto ${
        action === 'sort' ? 'h-[auto] border border-neutral-500' : 'h-0'
      }`}
    >
      <div className='w-full h-full px-6 py-8 flex justify-between gap-16'>
        <ul className='flex flex-col gap-2'>
          <li>
            <button
              className={`font-bold hover:text-red-500 ${
                searchParams.get('sortColumn') === 'name' &&
                searchParams.get('sortDirection') === 'asc'
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                closeSection();
                createQueryString(
                  ['sortColumn', 'sortDirection'],
                  ['name', 'asc']
                );
              }}
            >
              {t('sort_by_name_A_Z')}
            </button>
          </li>
          <li>
            <button
              className={`font-bold hover:text-red-500 ${
                searchParams.get('sortColumn') === 'name' &&
                searchParams.get('sortDirection') === 'desc'
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                closeSection();
                createQueryString(
                  ['sortColumn', 'sortDirection'],
                  ['name', 'desc']
                );
              }}
            >
              {t('sort_by_name_Z_A')}
            </button>
          </li>
          <li>
            <button
              className={`font-bold hover:text-red-500 ${
                searchParams.get('sortColumn') === 'latest'
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                closeSection();
                createQueryString('sortColumn', 'latest');
              }}
            >
              {t('sort_by_latest')}
            </button>
          </li>
          <li>
            <button
              className={`font-bold hover:text-red-500 ${
                searchParams.get('sortColumn') === 'oldest'
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                closeSection();
                createQueryString('sortColumn', 'oldest');
              }}
            >
              {t('sort_by_oldest')}
            </button>
          </li>
          <li>
            <button
              className={`font-bold hover:text-red-500 ${
                searchParams.get('sortColumn') === 'price' &&
                searchParams.get('sortDirection') === 'asc'
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                closeSection();
                createQueryString(
                  ['sortColumn', 'sortDirection'],
                  ['price', 'asc']
                );
              }}
            >
              {t('sort_by_price_low')}
            </button>
          </li>
          <li>
            <button
              className={`font-bold hover:text-red-500 ${
                searchParams.get('sortColumn') === 'price' &&
                searchParams.get('sortDirection') === 'desc'
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                closeSection();
                createQueryString(
                  ['sortColumn', 'sortDirection'],
                  ['price', 'desc']
                );
              }}
            >
              {t('sort_by_price_high')}
            </button>
          </li>
          <li>
            <button
              className={`font-bold hover:text-red-500 ${
                searchParams.get('sortColumn') === 'review'
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                closeSection();
                createQueryString('sortColumn', 'review');
              }}
            >
              {t('sort_by_average_rating')}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SortSection;
