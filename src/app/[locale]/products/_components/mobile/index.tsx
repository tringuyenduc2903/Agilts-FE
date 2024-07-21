'use client';
import BreadCrumbs from '@/components/ui/BreadCrumbs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FaSliders, FaMagnifyingGlass, FaAngleDown } from 'react-icons/fa6';
// import CategoriesSection from './CategoriesSection';
// import FilterSection from './FilterSection';
// import ProductsSection from './ProductSection';
// import { SkeletonCategory, SkeletonProduct } from './Skeleton';
// import SortSection from './SortSection';
import useQueryString from '@/lib/hooks/useQueryString';
import { convertData } from '@/lib/utils/format';
import RangeSlider from '@/components/ui/RangeSlider';
import ProductsSection from './ProductSection';
import ProductSkeleton from './Skeleton';

type Props = {
  filterData: any;
  isSuccessFilter: boolean;
  productsData: any;
  isSuccessProducts: boolean;
  isLoadingProducts: boolean;
  isFetchingProducts: boolean;
};

function ProductsMobile({
  filterData,
  isSuccessFilter,
  productsData,
  isSuccessProducts,
  isLoadingProducts,
  isFetchingProducts,
}: Props) {
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const [createQueryString, removeValueQueryString, deleteQueryString] =
    useQueryString();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [form, setForm] = useState({
    search: '',
    sort: {
      name: '',
      sortColumn: '',
      sortDirection: '',
    },
    category: {
      preview: '',
      name: '',
      value: '',
    },
    model: {
      name: '',
      value: '',
    },
    color: {
      name: '',
      value: '',
    },
  });
  const [priceMin, setPriceMin] = useState<string | number>(0);
  const [priceMax, setPriceMax] = useState<string | number>(0);

  const handleSelectedTab = useCallback((tab: string) => {
    setSelectedTab((prevTab) => {
      if (prevTab === tab) return null;
      return tab;
    });
  }, []);

  const renderedCategories = useMemo(() => {
    return convertData(filterData?.[5]?.data)?.map((d) => {
      return (
        <li className='h-max' key={d.id}>
          <button
            className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
              searchParams.get(filterData?.[5]?.name) === d.id.toString()
                ? 'text-red-500'
                : ''
            } transition-colors`}
            onClick={() => {
              setSelectedTab(null);
              setForm((prevForm) => ({
                ...prevForm,
                category: {
                  name: filterData?.[5]?.name,
                  preview: d.value,
                  value: d.id,
                },
              }));
            }}
          >
            {d.value}
          </button>
        </li>
      );
    });
  }, [filterData?.[5], searchParams]);

  const renderedModels = useMemo(() => {
    return convertData(filterData?.[4]?.data)?.map((d) => {
      return (
        <li className='h-max' key={d.id}>
          <button
            className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
              searchParams.get(filterData?.[4].name) === d.id.toString()
                ? 'text-red-500'
                : ''
            } transition-colors`}
            onClick={() => {
              setSelectedTab(null);
              setForm((prevForm) => ({
                ...prevForm,
                model: {
                  name: filterData?.[4]?.name,
                  value: d.id,
                },
              }));
            }}
          >
            {d.value}
          </button>
        </li>
      );
    });
  }, [filterData?.[4], searchParams]);

  const renderedColors = useMemo(() => {
    return convertData(filterData?.[3]?.data)?.map((d) => {
      return (
        <li className='h-max' key={d.id}>
          <button
            className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
              searchParams.get(filterData?.[3].name) === d.id.toString()
                ? 'text-red-500'
                : ''
            } transition-colors`}
            onClick={() => {
              setSelectedTab(null);
              setForm((prevForm) => ({
                ...prevForm,
                color: {
                  name: filterData?.[3]?.name,
                  value: d.id,
                },
              }));
            }}
          >
            {d.value}
          </button>
        </li>
      );
    });
  }, [filterData?.[3], searchParams]);

  const handleSort = useCallback(() => {
    createQueryString(
      [
        form.category.name,
        form.model.name,
        form.color.name,
        'minPrice',
        'maxPrice',
        'sortColumn',
        'sortDirection',
        'search',
      ],
      [
        form.category.value,
        form.model.value,
        form.color.value,
        priceMin.toString(),
        priceMax.toString(),
        form.sort.sortColumn,
        form.sort.sortDirection,
        form.search,
      ]
    );
    setIsOpenFilter(false);
  }, [createQueryString, form, priceMax, priceMin]);
  const handleSearch = useCallback(() => {
    if (form.search) {
      createQueryString('search', form.search);
    } else {
      removeValueQueryString('search');
    }
    setIsOpenFilter(false);
  }, [createQueryString, removeValueQueryString, form]);
  return (
    <section className='w-full min-h-screen py-8 m-auto px-4 overflow-hidden flex flex-col gap-6 text-sm md:text-base'>
      <div className='relative'>
        <button
          className='w-full sm:w-1/2 mx-auto flex justify-center items-center gap-4 border border-neutral-300 rounded-sm py-2'
          onClick={() => setIsOpenFilter(!isOpenFilter)}
        >
          <FaSliders />
          <p className='font-medium text-base'>{t('filter')}</p>
        </button>
        {isSuccessFilter && isOpenFilter && (
          <div className='absolute top-[125%] left-1/2 -translate-x-1/2 w-full sm:w-1/2 h-[70vh] md:h-[75vh] px-4 py-8 border border-neutral-300 bg-white z-[999] overflow-y-auto flex flex-col gap-6'>
            <div className='relative w-full'>
              <input
                className='px-4 py-2 w-full bg-neutral-100'
                type='text'
                value={form.search}
                onChange={(e) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    search: e.target.value,
                  }))
                }
                placeholder={t('search')}
              />
              <button
                className='absolute top-1/2 -translate-y-1/2 right-2'
                aria-label='search-btn'
                onClick={handleSearch}
              >
                <FaMagnifyingGlass />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-base font-medium'>{t('sort')}</h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('sort')}
              >
                <p>
                  {form?.sort?.sortColumn ? t(form?.sort?.name) : t('default')}
                </p>
                <FaAngleDown />
              </button>
              {selectedTab === 'sort' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  <li>
                    <button
                      className={`font-medium hover:text-red-500 ${
                        searchParams.get('sortColumn') === 'name' &&
                        searchParams.get('sortDirection') === 'asc'
                          ? 'text-red-500'
                          : ''
                      } transition-colors`}
                      onClick={() => (
                        setSelectedTab(null),
                        setForm((prevForm) => ({
                          ...prevForm,
                          sort: {
                            name: 'sort_by_name_A_Z',
                            sortColumn: 'name',
                            sortDirection: 'asc',
                          },
                        }))
                      )}
                    >
                      {t('sort_by_name_A_Z')}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`font-medium hover:text-red-500 ${
                        searchParams.get('sortColumn') === 'name' &&
                        searchParams.get('sortDirection') === 'desc'
                          ? 'text-red-500'
                          : ''
                      } transition-colors`}
                      onClick={() => (
                        setSelectedTab(null),
                        setForm((prevForm) => ({
                          ...prevForm,
                          sort: {
                            name: 'sort_by_name_Z_A',
                            sortColumn: 'name',
                            sortDirection: 'desc',
                          },
                        }))
                      )}
                    >
                      {t('sort_by_name_Z_A')}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`font-medium hover:text-red-500 ${
                        searchParams.get('sortColumn') === 'latest'
                          ? 'text-red-500'
                          : ''
                      } transition-colors`}
                      onClick={() => (
                        setSelectedTab(null),
                        setForm((prevForm) => ({
                          ...prevForm,
                          sort: {
                            name: 'sort_by_latest',
                            sortColumn: 'latest',
                            sortDirection: '',
                          },
                        }))
                      )}
                    >
                      {t('sort_by_latest')}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`font-medium hover:text-red-500 ${
                        searchParams.get('sortColumn') === 'oldest'
                          ? 'text-red-500'
                          : ''
                      } transition-colors`}
                      onClick={() => (
                        setSelectedTab(null),
                        setForm((prevForm) => ({
                          ...prevForm,
                          sort: {
                            name: 'sort_by_oldest',
                            sortColumn: 'oldest',
                            sortDirection: '',
                          },
                        }))
                      )}
                    >
                      {t('sort_by_oldest')}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`font-medium hover:text-red-500 ${
                        searchParams.get('sortColumn') === 'price' &&
                        searchParams.get('sortDirection') === 'asc'
                          ? 'text-red-500'
                          : ''
                      } transition-colors`}
                      onClick={() => (
                        setSelectedTab(null),
                        setForm((prevForm) => ({
                          ...prevForm,
                          sort: {
                            name: 'sort_by_price_low',
                            sortColumn: 'price',
                            sortDirection: 'asc',
                          },
                        }))
                      )}
                    >
                      {t('sort_by_price_low')}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`font-medium hover:text-red-500 ${
                        searchParams.get('sortColumn') === 'price' &&
                        searchParams.get('sortDirection') === 'desc'
                          ? 'text-red-500'
                          : ''
                      } transition-colors`}
                      onClick={() => (
                        setSelectedTab(null),
                        setForm((prevForm) => ({
                          ...prevForm,
                          sort: {
                            name: 'sort_by_price_high',
                            sortColumn: 'price',
                            sortDirection: 'desc',
                          },
                        }))
                      )}
                    >
                      {t('sort_by_price_high')}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`font-medium hover:text-red-500 ${
                        searchParams.get('sortColumn') === 'review'
                          ? 'text-red-500'
                          : ''
                      } transition-colors`}
                      onClick={() => (
                        setSelectedTab(null),
                        setForm((prevForm) => ({
                          ...prevForm,
                          sort: {
                            name: 'sort_by_average_rating',
                            sortColumn: 'review',
                            sortDirection: '',
                          },
                        }))
                      )}
                    >
                      {t('sort_by_average_rating')}
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-base font-medium'>{t('category')}</h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('category')}
              >
                <p>
                  {form?.category?.name ? form?.category?.preview : t('all')}
                </p>
                <FaAngleDown />
              </button>
              {selectedTab === 'category' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  {renderedCategories}
                </ul>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-base font-medium'>{t('model')}</h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('model')}
              >
                <p>{form?.model?.name ? form?.model?.value : t('all')}</p>
                <FaAngleDown />
              </button>
              {selectedTab === 'model' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  {renderedModels}
                </ul>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-base font-medium'>{t('color')}</h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('color')}
              >
                <p>{form?.color?.name ? form?.color?.value : t('all')}</p>
                <FaAngleDown />
              </button>
              {selectedTab === 'color' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  {renderedColors}
                </ul>
              )}
            </div>
            <div className='flex flex-col gap-4'>
              <h2 className='text-base font-medium'>{t('price')}</h2>
              <div className='w-full flex justify-center items-center'>
                <RangeSlider
                  min={Number(filterData[1]?.data)}
                  max={Number(filterData[2]?.data)}
                  onChange={({ min, max }) => {
                    setPriceMin(min);
                    setPriceMax(max);
                  }}
                />
              </div>
            </div>
            <div className='w-full flex justify-end gap-4'>
              <button
                className='px-6 py-2 border border-neutral-300 text-sm font-bold rounded-sm'
                onClick={() => (
                  setIsOpenFilter(false),
                  deleteQueryString(),
                  setForm({
                    search: '',
                    sort: {
                      name: '',
                      sortColumn: '',
                      sortDirection: '',
                    },
                    category: {
                      preview: '',
                      name: '',
                      value: '',
                    },
                    model: {
                      name: '',
                      value: '',
                    },
                    color: {
                      name: '',
                      value: '',
                    },
                  })
                )}
              >
                {t('reset')}
              </button>
              <button
                className='px-6 py-2 bg-red-500 text-neutral-50 border border-red-500 rounded-sm'
                onClick={handleSort}
              >
                {t('apply')}
              </button>
            </div>
          </div>
        )}
      </div>
      {!isFetchingProducts && productsData && (
        <div className='w-full flex justify-center'>
          {productsData?.total > 0 ? (
            <h3 className='text-sm md:text-base font-medium tracking-[2px]'>
              {t('showing')} {productsData?.from}-{productsData?.to} {t('of')}{' '}
              {productsData?.total} {t('results')}
            </h3>
          ) : (
            <h3 className='text-sm md:text-base font-medium tracking-[2px]'>
              {t('showing')} {productsData?.total} {t('result')}
            </h3>
          )}
        </div>
      )}
      {!isLoadingProducts &&
        !isFetchingProducts &&
        isSuccessProducts &&
        productsData?.data?.length > 0 && (
          <ProductsSection
            products={productsData?.data}
            total_pages={productsData?.total_pages}
            current_page={productsData?.current_page}
          />
        )}
      {(isLoadingProducts || isFetchingProducts) && <ProductSkeleton />}
      {!isLoadingProducts &&
        isSuccessProducts &&
        productsData?.data?.length === 0 && (
          <div className='w-full h-[50vh] flex justify-center items-center'>
            <p className='text-xl sm:text-2xl md:text-4xl font-bold'>
              {t('mess_no_product')}
            </p>
          </div>
        )}
    </section>
  );
}

export default ProductsMobile;
