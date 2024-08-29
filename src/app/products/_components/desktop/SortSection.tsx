import { sortItem } from '@/config/config';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { FaCheck } from 'react-icons/fa6';
type Props = any;
function SortSection({ action, closeAction }: Props) {
  const [createQueryString] = useQueryString();
  const searchParams = useSearchParams();
  const isActive = useCallback(
    (column: string, direction: string | null) => {
      const currentColumn = searchParams.get('sortColumn');
      const currentDirection = searchParams.get('sortDirection');
      return (
        currentColumn === column &&
        (!direction || currentDirection === direction)
      );
    },
    [searchParams]
  );
  return (
    <div
      className={`absolute top-[110%] right-0 bg-white w-max flex flex-col gap-2 ${
        action === 'sort'
          ? `opacity-100 z-50 border border-neutral-500`
          : 'opacity-0 -z-10'
      } transition-all duration-150 overflow-hidden`}
    >
      {sortItem?.map((s) => {
        const activeClass = isActive(s.sortColumn, s.sortDirection)
          ? 'text-red-500'
          : '';

        return (
          <button
            key={s.preview}
            className={`px-4 py-2 text-start w-full flex justify-between items-center gap-4 font-bold ${activeClass}`}
            onClick={() => {
              closeAction();
              createQueryString(
                ['sortColumn', 'sortDirection'],
                [s.sortColumn, s.sortDirection || '']
              );
            }}
          >
            {s.preview}
            {isActive(s.sortColumn, s.sortDirection) ? (
              <FaCheck className='text-red-500' />
            ) : (
              <span className='size-4'></span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default SortSection;
