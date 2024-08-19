'use client';
import React, { useEffect, useMemo } from 'react';
import CustomPaginationV2 from '@/components/ui/CustomPaginationV2';
import NotFoundItem from '@/components/ui/NotFoundItem';
import Stars from '@/components/ui/Stars';
import useQueryString from '@/lib/hooks/useQueryString';
import { convertData } from '@/lib/utils/format';
import { Review } from '@/types/types';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import CustomImage from '@/components/ui/CustomImage';
import { useFetch } from '@/lib/hooks/useFetch';
import { getFilterReview, getProductReview } from '@/api/product';
import LoadingMultiItem from '@/components/ui/LoadingMultiItem';

function Reviews({
  product_id,
  reviews_avg_rate,
  reviews_count,
}: {
  product_id: number | string;
  reviews_avg_rate: number | string;
  reviews_count: number | string;
}) {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const [createQueryString, removeValueQueryString] = useQueryString();
  const {
    fetchData: getProductReviewMutation,
    data: reviewData,
    isLoading: isLoadingReview,
    isSuccess: isSuccessReview,
  } = useFetch(
    async () =>
      await getProductReview({
        id: product_id,
        search: searchParams.toString(),
      })
  );
  const {
    fetchData: getFilterReviewMutation,
    data: filterData,
    isLoading: isLoadingFilter,
    isSuccess: isSuccessFilter,
  } = useFetch(async () => await getFilterReview(product_id));
  const renderedFilter = useMemo(() => {
    return (
      isSuccessFilter &&
      convertData(filterData?.[0]?.data)?.map((d) => {
        return (
          <button
            className={`w-max rounded-sm bg-white py-2 px-4 text-sm md:text-base text-medium border ${
              searchParams.get(filterData?.[0]?.name) === d?.id
                ? 'border-red-500 text-red-600'
                : 'border-neutral-300'
            }`}
            key={d?.id}
            onClick={() =>
              createQueryString(filterData?.[0]?.name, d.id, false)
            }
          >
            {d?.value}
          </button>
        );
      })
    );
  }, [searchParams, isSuccessFilter, filterData, createQueryString]);
  const renderedReviews = useMemo(() => {
    return (
      isSuccessReview &&
      reviewData?.data?.map((r: Review) => {
        return (
          <article
            className='flex flex-col gap-2 text-sm md:text-base'
            key={r.id}
          >
            <div className='flex'>
              <Stars rate={Number(r?.rate)} size={16} />
            </div>
            <div className='text-sm md:text-base flex flex-col sm:flex-row sm:items-center gap-2'>
              <p className='font-bold'>{r?.reviewable_preview?.name}</p>
              <span className='hidden sm:block w-4 h-[1px] bg-neutral-800'></span>
              <p className='text-neutral-500'>{r?.created_at}</p>
            </div>
            {r?.parent_preview?.version && (
              <p className='text-sm md:text-base text-neutral-600'>
                {t('version')}:{' '}
                <span className='font-bold'>{r?.parent_preview?.version}</span>
              </p>
            )}
            {r?.parent_preview?.volume && (
              <p className='text-sm md:text-base text-neutral-600'>
                {t('volume')}:{' '}
                <span className='font-bold'>{r?.parent_preview?.volume}</span>
              </p>
            )}
            {r?.parent_preview?.color && (
              <p className='text-sm md:text-base text-neutral-600'>
                {t('color')}:{' '}
                <span className='font-bold'>{r?.parent_preview?.color}</span>
              </p>
            )}
            <p className='text-neutral-500 text-sm md:text-base'>
              {r?.content}
            </p>
            {r?.images?.length > 0 && (
              <div className='flex flex-wrap gap-4'>
                <CustomImage
                  isShowDetails={true}
                  images={r.images}
                  width={128}
                  height={128}
                />
              </div>
            )}
            {r.response && (
              <div className='bg-white rounded-sm p-4 flex flex-col gap-2'>
                <p className='font-medium'>
                  {t('seller_feedback', {
                    name: r?.response?.reviewable_preview?.name,
                  })}
                </p>
                <p>{r?.content}</p>
              </div>
            )}
          </article>
        );
      })
    );
  }, [isSuccessReview, reviewData, t]);
  useEffect(() => {
    getFilterReviewMutation();
  }, []);
  useEffect(() => {
    getProductReviewMutation();
  }, [searchParams]);
  return (
    <section
      id='reviews'
      className='container md:m-auto px-6 md:px-0 flex flex-col gap-4'
    >
      <h2 className='text-xl md:text-2xl font-bold'>
        {t('reviews')}{' '}
        {Number(reviews_count) > 0 &&
          `(${Math.ceil(Number(reviews_avg_rate) * 2) / 2}/5)`}
      </h2>
      <div className='py-8 px-4 sm:px-8 md:px-16 bg-neutral-100 flex flex-col gap-12 rounded-sm border-t-4 border-red-600'>
        <div className='flex flex-wrap gap-4'>
          <button
            className={`w-max rounded-sm bg-white py-2 px-4 text-sm md:text-base text-medium border ${
              !searchParams.get(filterData?.[0]?.name)
                ? 'border-red-500 text-red-600'
                : 'border-neutral-300'
            }`}
            onClick={() => removeValueQueryString(filterData?.[0]?.name)}
          >
            {t('all')}
          </button>
          {!isLoadingFilter && renderedFilter}
          {isLoadingFilter && (
            <LoadingMultiItem
              number={8}
              customClass='w-[92px] h-[42px] skeleton'
            />
          )}
        </div>
        {Number(reviews_count) > 0 && (
          <div className='flex flex-col gap-6'>
            {!isLoadingReview && isSuccessReview && renderedReviews}
            {isLoadingReview && (
              <LoadingMultiItem
                number={12}
                customClass='w-full h-[280px] skeleton'
              />
            )}
            {isSuccessReview && reviewData?.total_pages > 1 && (
              <div className='mt-4 flex justify-center items-center sm:justify-start'>
                <CustomPaginationV2 totalPage={reviewData?.total_pages} />
              </div>
            )}
          </div>
        )}
        {(Number(reviews_count) === 0 || reviewData?.data?.length === 0) && (
          <div className='h-[20vh] flex justify-center items-center'>
            <NotFoundItem message={t('mess_no_review')} />
          </div>
        )}
      </div>
    </section>
  );
}

export default Reviews;
