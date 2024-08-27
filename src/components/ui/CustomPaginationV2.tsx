'use client';
import React, { useCallback } from 'react';
import {
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
} from '@nextui-org/react';
import useQueryString from '@/lib/hooks/useQueryString';
import { useSearchParams } from 'next/navigation';
import { scrollToTop } from '@/lib/utils/scrollElement';
type Props = {
  totalPage: number;
  scroll?: boolean;
};

const CustomPaginationV2: React.FC<Props> = ({ totalPage, scroll = false }) => {
  const [createQueryString] = useQueryString();
  const searchQuery = useSearchParams();
  const curPage = Number(searchQuery.get('page')) || 1;
  const handleNext = useCallback(
    (page: string) => {
      if (page === 'next') {
        const nextPage = curPage >= totalPage ? totalPage : curPage + 1;
        createQueryString('page', nextPage.toString(), false);
        scroll && scrollToTop();
      }
    },
    [createQueryString, totalPage, curPage, scroll]
  );

  const handlePrevious = useCallback(
    (page: string) => {
      if (page === 'prev') {
        const prev = curPage <= 1 ? 1 : curPage - 1;
        createQueryString('page', prev.toString(), false);
        scroll && scrollToTop();
      }
    },
    [createQueryString, curPage, scroll]
  );
  const handleSetPage = useCallback(
    (page: number) => {
      createQueryString('page', page.toString(), false);
      scroll && scrollToTop();
    },
    [createQueryString, scroll]
  );

  const renderItems = ({ key, value }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={`${
            totalPage > 1 ? 'block' : 'hidden'
          } w-max h-full px-2 py-1 rounded-sm border border-neutral-300 text-neutral-800 text-sm md:text-base ${
            curPage >= totalPage && 'cursor-not-allowed'
          }`}
          onClick={() => handleNext(value)}
          disabled={curPage >= totalPage}
        >
          Sau
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={`${
            curPage !== 1 ? 'block' : 'hidden'
          } w-max h-full px-2 py-1 rounded-sm border border-neutral-300 text-neutral-800 text-sm md:text-base ${
            curPage <= 1 && 'cursor-not-allowed'
          }`}
          onClick={() => handlePrevious(value)}
          disabled={curPage <= 1}
        >
          Trước
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className='rounded-sm px-2 py-1'>
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        className={`w-max h-full px-2 py-1 border border-neutral-300 rounded-sm text-sm md:text-base
          ${curPage === value && 'bg-red-500 text-white'}`}
        onClick={() => handleSetPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <Pagination
      showControls
      color='secondary'
      page={curPage}
      total={totalPage}
      siblings={0}
      boundaries={1}
      renderItem={renderItems}
    />
  );
};

export default CustomPaginationV2;
