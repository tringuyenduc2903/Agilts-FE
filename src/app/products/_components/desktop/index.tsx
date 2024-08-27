'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import ProductsSection from './ProductSection';
import { SkeletonProduct } from './Skeleton';
import useQueryString from '@/lib/hooks/useQueryString';
import { VscSettings } from 'react-icons/vsc';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { GrSort } from 'react-icons/gr';
import Link from 'next/link';
import FilterSection from './FilterSection';
import { convertData } from '@/lib/utils/format';
import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
import SortSection from './SortSection';

type Props = {
  filterData: any;
  isSuccessFilter: boolean;
  isLoadingFilter: boolean;
  productsData: any;
  isSuccessProducts: boolean;
  isLoadingProducts: boolean;
  page: string;
};

function ProductsDesktop({
  filterData,
  isSuccessFilter,
  isLoadingFilter,
  productsData,
  isSuccessProducts,
  isLoadingProducts,
  page,
}: Props) {
  const searchParams = useSearchParams();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [createQueryString, removeValueQueryString] = useQueryString();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleSelectedAction = useCallback((action: string) => {
    setSelectedAction((prevAction) => (prevAction === action ? null : action));
  }, []);

  const handleSearch = useCallback(() => {
    const searchValue = searchParams.get('search');
    if (searchValue) {
      createQueryString('search', searchValue);
    } else {
      removeValueQueryString('search');
    }
  }, [searchParams, createQueryString, removeValueQueryString]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkCarouselButtons = useCallback(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = carouselRef.current;
      setShowPrevButton(scrollLeft > 0);
      setShowNextButton(scrollLeft + clientWidth < scrollWidth);
    }
  }, []);

  useEffect(() => {
    handleSearch();
    checkCarouselButtons();
    window.addEventListener('resize', checkCarouselButtons);

    return () => {
      window.removeEventListener('resize', checkCarouselButtons);
    };
  }, [handleSearch, checkCarouselButtons]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', checkCarouselButtons);
      return () => {
        if (carouselRef.current) {
          carouselRef.current.removeEventListener(
            'scroll',
            checkCarouselButtons
          );
        }
      };
    }
  }, [checkCarouselButtons]);

  const formatFilter = useMemo(() => {
    const formatted: { [key: string]: any } = {};
    if (isSuccessFilter && filterData) {
      filterData.forEach((f: any) => {
        formatted[f.name] = f;
      });
    }
    return formatted;
  }, [isSuccessFilter, filterData]);

  const renderedCategory = useMemo(() => {
    return (
      isSuccessFilter &&
      formatFilter?.category &&
      convertData(formatFilter?.category?.data)?.map((d) => (
        <div key={d.id} className='carousel-item'>
          <button
            className={`flex items-center gap-4 text-lg uppercase font-bold ${
              searchParams.get('category') === d.id.toString()
                ? 'text-red-500'
                : ''
            }`}
            onClick={() => createQueryString('category', d.id)}
          >
            {d?.value}
          </button>
        </div>
      ))
    );
  }, [
    isSuccessFilter,
    formatFilter?.category,
    createQueryString,
    searchParams,
  ]);

  return (
    <>
      {selectedAction === 'filter' && (
        <FilterSection
          filter={formatFilter}
          isSuccessFilter={isSuccessFilter}
          closeFilter={() => setSelectedAction(null)}
        />
      )}
      <section className='bg-neutral-100 text-neutral-800'>
        <div className='py-6 px-4 md:px-8 xl:px-16 flex flex-wrap items-center gap-4 text-base'>
          <Link
            className='font-bold uppercase tracking-[2px] hover:text-red-500 transition-colors'
            href='/'
          >
            Trang chủ
          </Link>
          <span className='w-[32px] relative before:absolute before:w-[24px] before:h-[1px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-neutral-800'></span>
          <p className='font-bold uppercase tracking-[2px]'>{page}</p>
        </div>
      </section>
      <section className='m-auto py-4 px-4 md:px-8 xl:px-16 overflow-hidden'>
        <div className='flex items-center justify-between my-4'>
          {showPrevButton && (
            <button
              className='bg-red-600 hover:bg-red-500 transition-colors px-1 py-2'
              aria-label='left-carousel'
              onClick={() => scrollCarousel('left')}
            >
              <FaAngleLeft className='text-xl text-white' />
            </button>
          )}
          <div ref={carouselRef} className='carousel-container'>
            <div className='carousel-item'>
              <button
                className={`flex items-center gap-4 text-lg uppercase font-bold ${
                  !searchParams.get('category') ? 'text-red-500' : ''
                }`}
                onClick={() => removeValueQueryString('category')}
              >
                Tất cả
              </button>
            </div>
            {!isLoadingFilter && renderedCategory}
            {isLoadingFilter && (
              <LoadingMultiItem
                customClass='w-[42px] h-6 skeleton'
                number={5}
              />
            )}
          </div>
          {showNextButton && (
            <button
              className='bg-red-600 hover:bg-red-500 transition-colors px-1 py-2'
              aria-label='right-carousel'
              onClick={() => scrollCarousel('right')}
            >
              <FaAngleRight className='text-xl text-white' />
            </button>
          )}
        </div>
      </section>
      <section className='m-auto py-4 px-4 md:px-8 xl:px-16 w-full flex justify-between items-center gap-6'>
        <div className='flex items-center gap-6'>
          <button
            className='flex items-center gap-2 border border-neutral-500 px-4 py-2 rounded-sm font-medium'
            onClick={() => handleSelectedAction('filter')}
          >
            <VscSettings className='text-2xl' />
            <span>Tìm kiếm nâng cao</span>
          </button>
          {!isLoadingProducts && (
            <h3 className='text-lg text-start font-medium tracking-[2px]'>
              Hiển thị {productsData?.from || 0}-{productsData?.to || 0} trên{' '}
              {productsData?.total} kết quả
            </h3>
          )}
          {isLoadingProducts && (
            <div className='w-[280px] h-[24px] skeleton'></div>
          )}
        </div>
        <div className='relative'>
          <button
            className='flex items-center gap-2 border border-neutral-500 px-4 py-2 rounded-sm font-medium'
            onClick={() => handleSelectedAction('sort')}
          >
            <GrSort className='text-2xl' />
            <span>Sắp xếp</span>
          </button>
          <SortSection
            action={selectedAction}
            closeAction={() => setSelectedAction(null)}
          />
        </div>
      </section>
      <section className='w-full min-h-screen py-16 m-auto px-4 md:px-8 xl:px-16 gap-16 overflow-hidden'>
        <div className='h-full flex flex-col gap-16'>
          {!isLoadingProducts &&
            isSuccessProducts &&
            productsData?.data?.length > 0 && (
              <ProductsSection
                products={productsData?.data}
                total_pages={productsData?.total_pages}
                current_page={productsData?.current_page}
              />
            )}
          {isLoadingProducts && <SkeletonProduct />}
          {!isLoadingProducts &&
            isSuccessProducts &&
            productsData?.data?.length === 0 && (
              <div className='w-full h-full flex justify-center items-center'>
                <p className='text-xl sm:text-2xl md:text-4xl font-bold'>
                  Hiện chưa có sản phẩm!
                </p>
              </div>
            )}
        </div>
      </section>
    </>
  );
}

export default ProductsDesktop;
