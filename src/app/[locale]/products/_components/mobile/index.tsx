'use client';
import React, { LegacyRef, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FaSliders, FaMagnifyingGlass, FaAngleDown } from 'react-icons/fa6';
import useQueryString from '@/lib/hooks/useQueryString';
import { convertData } from '@/lib/utils/format';
import RangeSlider from '@/components/ui/RangeSlider';
import ProductsSection from './ProductSection';
import ProductSkeleton from './Skeleton';
import useClickOutside from '@/lib/hooks/useClickOutside';

type Props = {
  filterData: any;
  isSuccessFilter: boolean;
  productsData: any;
  isSuccessProducts: boolean;
  isLoadingProducts: boolean;
};

function ProductsMobile({
  filterData,
  isSuccessFilter,
  productsData,
  isSuccessProducts,
  isLoadingProducts,
}: Props) {
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const [createQueryString, removeValueQueryString, deleteQueryString] =
    useQueryString();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const { sectionRef } = useClickOutside(() => setIsOpenFilter(false));
  const [form, setForm] = useState({
    search: '',
    sort: {
      name: '',
      sortColumn: '',
      sortDirection: '',
    },
    manufacturer: '',
    option_type: '',
    category: {
      preview: '',
      name: '',
      value: '',
    },
    version: {
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
  const formatFilter = useMemo(() => {
    const formatted: { [key: string]: any } = {};
    if (isSuccessFilter && filterData) {
      filterData?.forEach((f: any) => {
        formatted[f.name] = f;
      });
    }
    return formatted;
  }, [isSuccessFilter, filterData]);
  const renderedManufacturer = useMemo(() => {
    return (
      isSuccessFilter &&
      convertData(formatFilter?.manufacturer?.data)?.map((d) => {
        return (
          <li className='h-max' key={d.id}>
            <button
              className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                searchParams.get(formatFilter?.manufacturer?.name) ===
                d.id.toString()
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                setSelectedTab(null);
                setForm((prevForm) => ({
                  ...prevForm,
                  manufacturer: d.value,
                }));
              }}
            >
              {d.value}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessFilter, formatFilter?.manufacturer, searchParams]);
  const renderedOptionType = useMemo(() => {
    return (
      isSuccessFilter &&
      formatFilter?.option_type?.data?.map((d: string) => {
        return (
          <li className='h-max' key={d}>
            <button
              className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                searchParams.get(formatFilter?.manufacturer?.name) ===
                d.toString()
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                setSelectedTab(null);
                setForm((prevForm) => ({
                  ...prevForm,
                  option_type: d,
                }));
              }}
            >
              {d}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessFilter, formatFilter?.option_type, searchParams]);
  const renderedCategories = useMemo(() => {
    return (
      isSuccessFilter &&
      convertData(formatFilter?.category?.data)?.map((d) => {
        return (
          <li className='h-max' key={d.id}>
            <button
              className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                searchParams.get(formatFilter?.category?.name) ===
                d.id.toString()
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                setSelectedTab(null);
                setForm((prevForm) => ({
                  ...prevForm,
                  category: {
                    name: formatFilter?.category?.name,
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
      })
    );
  }, [isSuccessFilter, formatFilter?.category, searchParams]);

  const renderedVersion = useMemo(() => {
    return (
      isSuccessFilter &&
      convertData(formatFilter?.version?.data)?.map((d) => {
        return (
          <li className='h-max' key={d.id}>
            <button
              className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                searchParams.get(formatFilter?.version.name) === d.id.toString()
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                setSelectedTab(null);
                setForm((prevForm) => ({
                  ...prevForm,
                  model: {
                    name: formatFilter?.version?.name,
                    value: d.id,
                  },
                }));
              }}
            >
              {d.value}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessFilter, formatFilter?.version, searchParams]);

  const renderedColors = useMemo(() => {
    return (
      isSuccessFilter &&
      convertData(formatFilter?.color?.data)?.map((d) => {
        return (
          <li className='h-max' key={d.id}>
            <button
              className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                searchParams.get(formatFilter?.color.name) === d.id.toString()
                  ? 'text-red-500'
                  : ''
              } transition-colors`}
              onClick={() => {
                setSelectedTab(null);
                setForm((prevForm) => ({
                  ...prevForm,
                  color: {
                    name: formatFilter?.color?.name,
                    value: d.id,
                  },
                }));
              }}
            >
              {d.value}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessFilter, formatFilter?.color, searchParams]);

  const handleSort = useCallback(() => {
    createQueryString(
      [
        'manufacturer',
        'option_type',
        form.category.name,
        form.version.name,
        form.color.name,
        'minPrice',
        'maxPrice',
        'sortColumn',
        'sortDirection',
        'search',
      ],
      [
        form.manufacturer,
        form.option_type,
        form.version.value,
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
      <div className='relative' ref={sectionRef as LegacyRef<HTMLDivElement>}>
        <button
          className='w-full mx-auto flex justify-center items-center gap-4 border border-neutral-300 rounded-sm py-2'
          onClick={() => setIsOpenFilter(!isOpenFilter)}
        >
          <FaSliders />
          <p className='font-medium text-base'>{t('filter')}</p>
        </button>
        {isSuccessFilter && isOpenFilter && (
          <div className='absolute top-[125%] left-1/2 -translate-x-1/2 w-full h-[70vh] md:h-[75vh] px-4 py-8 border border-neutral-300 bg-white z-50 overflow-y-auto flex flex-col gap-6'>
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
              <h2 className='text-base font-medium'>
                {formatFilter?.manufacturer?.label}
              </h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('manufacturer')}
              >
                <p>{form?.manufacturer ? form?.manufacturer : t('all')}</p>
                <FaAngleDown />
              </button>
              {selectedTab === 'manufacturer' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  {renderedManufacturer}
                </ul>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-base font-medium'>
                {formatFilter?.option_type?.label}
              </h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('option_type')}
              >
                <p>{form?.option_type ? form?.option_type : t('all')}</p>
                <FaAngleDown />
              </button>
              {selectedTab === 'option_type' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  {renderedOptionType}
                </ul>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-base font-medium'>
                {formatFilter?.category?.label}
              </h2>
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
              <h2 className='text-base font-medium'>
                {formatFilter?.version?.label}
              </h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('model')}
              >
                <p>{form?.version?.name ? form?.version?.value : t('all')}</p>
                <FaAngleDown />
              </button>
              {selectedTab === 'model' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  {renderedVersion}
                </ul>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h2 className='text-base font-medium'>
                {formatFilter?.color?.label}
              </h2>
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
                  min={Number(formatFilter?.minPrice?.data?.raw)}
                  max={Number(formatFilter?.maxPrice?.data?.raw)}
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
                    manufacturer: '',
                    option_type: '',
                    category: {
                      preview: '',
                      name: '',
                      value: '',
                    },
                    version: {
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
      {!isLoadingProducts && productsData && (
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
        isSuccessProducts &&
        productsData?.data?.length > 0 && (
          <ProductsSection
            products={productsData?.data}
            total_pages={productsData?.total_pages}
            // current_page={productsData?.current_page}
          />
        )}
      {isLoadingProducts && <ProductSkeleton />}
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
