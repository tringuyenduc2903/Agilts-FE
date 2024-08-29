'use client';
import React, {
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { FaSliders, FaMagnifyingGlass, FaAngleDown } from 'react-icons/fa6';
import useQueryString from '@/lib/hooks/useQueryString';
import {
  convertData,
  formatAndPreserveCursor,
  formatNumber,
} from '@/lib/utils/format';
import ProductsSection from './ProductSection';
import ProductSkeleton from './Skeleton';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { sortItem } from '@/config/config';

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
  useQueryString();
  const [selectedTab, setSelectedTab] = useState<string | null>(null);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const sectionRef = useClickOutside(() => setIsOpenFilter(false));
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
  const [createQueryString, removeValueQueryString, deleteQueryString] =
    useQueryString();
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
    volume: {
      name: '',
      value: '',
    },
  });
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(0);
  useEffect(() => {
    if (Number(searchParams.get('minPrice'))) {
      setPriceMin(Number(searchParams.get('minPrice')));
    }
    if (Number(searchParams.get('maxPrice'))) {
      setPriceMax(Number(searchParams.get('maxPrice')));
    }
  }, [searchParams]);
  const handleInputNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const value = e.target.value.replace(/\D/g, '');
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setForm({ ...form, [name]: numericValue });
      if (name === 'priceMin') {
        setPriceMin(numericValue);
      }
      if (name === 'priceMax') {
        setPriceMax(numericValue);
      }
    }
  };
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
  const handleDeleteAll = useCallback(() => {
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
        volume: {
          name: '',
          value: '',
        },
      });
  }, [deleteQueryString]);
  const renderedManufacturer = useMemo(() => {
    return (
      (isSuccessFilter &&
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
        })) ||
      []
    );
  }, [
    isSuccessFilter,
    formatFilter?.manufacturer?.data,
    formatFilter?.manufacturer?.name,
    searchParams,
  ]);
  const renderedSort = useMemo(() => {
    return (
      (isSuccessFilter &&
        sortItem?.map((s) => {
          const activeClass = isActive(s.sortColumn, s.sortDirection)
            ? 'text-red-500'
            : '';
          return (
            <li className='h-max' key={s.preview}>
              <button
                className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                  searchParams.get(formatFilter?.manufacturer?.name) ===
                  activeClass
                    ? 'text-red-500'
                    : ''
                } transition-colors`}
                onClick={() => {
                  setSelectedTab(null);
                  setForm((prevForm) => ({
                    ...prevForm,
                    sort: {
                      name: s.preview,
                      sortColumn: s.sortColumn,
                      sortDirection: s.sortDirection ? s.sortDirection : '',
                    },
                  }));
                }}
              >
                {s.preview}
              </button>
            </li>
          );
        })) ||
      []
    );
  }, [
    isSuccessFilter,
    formatFilter?.manufacturer?.data,
    formatFilter?.manufacturer?.name,
    searchParams,
  ]);
  const renderedOptionType = useMemo(() => {
    return (
      (isSuccessFilter &&
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
        })) ||
      []
    );
  }, [
    isSuccessFilter,
    formatFilter?.option_type?.data,
    formatFilter?.manufacturer?.name,
    searchParams,
  ]);
  const renderedCategories = useMemo(() => {
    return (
      (isSuccessFilter &&
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
        })) ||
      []
    );
  }, [isSuccessFilter, formatFilter?.category, searchParams]);

  const renderedVersion = useMemo(() => {
    return (
      (isSuccessFilter &&
        convertData(formatFilter?.version?.data)?.map((d) => {
          return (
            <li className='h-max' key={d.id}>
              <button
                className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                  searchParams.get(formatFilter?.version.name) ===
                  d.id.toString()
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
        })) ||
      []
    );
  }, [isSuccessFilter, formatFilter?.version, searchParams]);

  const renderedColors = useMemo(() => {
    return (
      (isSuccessFilter &&
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
        })) ||
      []
    );
  }, [isSuccessFilter, formatFilter?.color, searchParams]);
  const renderedVolume = useMemo(() => {
    return (
      (isSuccessFilter &&
        convertData(formatFilter?.volume?.data)?.map((d) => {
          return (
            <li className='h-max' key={d.id}>
              <button
                className={`font-medium text-sm md:text-base text-neutral-500 hover:text-red-500 ${
                  searchParams.get(formatFilter?.volume.name) ===
                  d.id.toString()
                    ? 'text-red-500'
                    : ''
                } transition-colors`}
                onClick={() => {
                  setSelectedTab(null);
                  setForm((prevForm) => ({
                    ...prevForm,
                    volume: {
                      name: formatFilter?.volume?.name,
                      value: d.id,
                    },
                  }));
                }}
              >
                {d.value}
              </button>
            </li>
          );
        })) ||
      []
    );
  }, [isSuccessFilter, formatFilter?.volume, searchParams]);
  const handleSort = useCallback(() => {
    createQueryString(
      [
        'manufacturer',
        'option_type',
        form.category.name,
        form.version.name,
        form.color.name,
        form.volume.name,
        'minPrice',
        'maxPrice',
        'sortColumn',
        'sortDirection',
        'search',
      ],
      [
        form.manufacturer,
        form.option_type,
        form.category.value,
        form.version.value,
        form.color.value,
        form.volume.value,
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
          <p className='font-medium text-base'>Tìm kiếm nâng cao</p>
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
                placeholder='Nhập tìm kiếm...'
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
              <h2 className='text-base font-medium'>Sắp xếp</h2>
              <button
                className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                onClick={() => handleSelectedTab('sort')}
              >
                <p>{form?.sort?.sortColumn ? form?.sort?.name : 'Mặc định'}</p>
                <FaAngleDown />
              </button>
              {selectedTab === 'sort' && (
                <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                  {renderedSort}
                </ul>
              )}
            </div>
            {renderedManufacturer?.length > 0 && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-base font-medium'>
                  {formatFilter?.manufacturer?.label}
                </h2>
                <button
                  className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                  onClick={() => handleSelectedTab('manufacturer')}
                >
                  <p>
                    {form?.manufacturer
                      ? form?.manufacturer
                      : 'Tất cả nhà sản xuất'}
                  </p>
                  <FaAngleDown />
                </button>
                {selectedTab === 'manufacturer' && (
                  <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                    {renderedManufacturer}
                  </ul>
                )}
              </div>
            )}
            {renderedOptionType?.length > 0 && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-base font-medium'>
                  {formatFilter?.option_type?.label}
                </h2>
                <button
                  className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                  onClick={() => handleSelectedTab('option_type')}
                >
                  <p>{form?.option_type ? form?.option_type : ''}</p>
                  <FaAngleDown />
                </button>
                {selectedTab === 'option_type' && (
                  <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                    {renderedOptionType}
                  </ul>
                )}
              </div>
            )}
            {renderedCategories?.length > 0 && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-base font-medium'>
                  {formatFilter?.category?.label}
                </h2>
                <button
                  className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                  onClick={() => handleSelectedTab('category')}
                >
                  <p>
                    {form?.category?.name
                      ? form?.category?.preview
                      : 'Tất cả danh mục'}
                  </p>
                  <FaAngleDown />
                </button>
                {selectedTab === 'category' && (
                  <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                    {renderedCategories}
                  </ul>
                )}
              </div>
            )}
            {renderedVersion?.length > 0 && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-base font-medium'>
                  {formatFilter?.version?.label}
                </h2>
                <button
                  className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                  onClick={() => handleSelectedTab('model')}
                >
                  <p>
                    {form?.version?.name
                      ? form?.version?.value
                      : 'Tất cả các phiên bản'}
                  </p>
                  <FaAngleDown />
                </button>
                {selectedTab === 'model' && (
                  <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                    {renderedVersion}
                  </ul>
                )}
              </div>
            )}
            {renderedColors?.length > 0 && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-base font-medium'>
                  {formatFilter?.color?.label}
                </h2>
                <button
                  className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                  onClick={() => handleSelectedTab('color')}
                >
                  <p>
                    {form?.color?.name ? form?.color?.value : 'Tất cả màu sắc'}
                  </p>
                  <FaAngleDown />
                </button>
                {selectedTab === 'color' && (
                  <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                    {renderedColors}
                  </ul>
                )}
              </div>
            )}
            {renderedVolume?.length > 0 && (
              <div className='flex flex-col gap-2'>
                <h2 className='text-base font-medium'>
                  {formatFilter?.volume?.label}
                </h2>
                <button
                  className='w-full px-4 py-2 border border-neutral-300 flex justify-between items-center'
                  onClick={() => handleSelectedTab('volume')}
                >
                  <p>
                    {form?.volume?.name
                      ? form?.volume?.value
                      : 'Tất cả thể tích'}
                  </p>
                  <FaAngleDown />
                </button>
                {selectedTab === 'volume' && (
                  <ul className='w-full h-auto max-h-[40vh] p-4 flex flex-col gap-1 border border-neutral-300 overflow-y-auto'>
                    {renderedVolume}
                  </ul>
                )}
              </div>
            )}
            {formatFilter?.minPrice?.data?.raw &&
              formatFilter?.maxPrice?.data?.raw && (
                <div className='w-full py-6 flex flex-col gap-8'>
                  <h2 className='text-lg font-bold'>Giá tiền</h2>
                  <div className='h-max flex flex-col justify-between items-center gap-4'>
                    <div className='w-full flex flex-col gap-12'>
                      <div className='relative w-full border border-neutral-300 rounded-sm flex justify-between items-center'>
                        <p className='absolute -top-3/4 text-neutral-500'>
                          Từ ({formatFilter?.minPrice?.data?.preview})
                        </p>
                        <input
                          className='w-11/12 px-4 py-2 border-r border-neutral-300'
                          type='text'
                          name='priceMin'
                          value={formatNumber(priceMin)}
                          onChange={(e) => {
                            handleInputNumberChange(e);
                            formatAndPreserveCursor(e);
                          }}
                          placeholder='Từ'
                        />
                        <p className='w-1/12 p-2'>VND</p>
                      </div>
                      <div className='relative w-full border border-neutral-300 rounded-sm flex justify-between items-center'>
                        <p className='absolute -top-3/4 text-neutral-500'>
                          Đến ({formatFilter?.maxPrice?.data?.preview})
                        </p>
                        <input
                          className='w-11/12 px-4 py-2 border-r border-neutral-300'
                          type='text'
                          name='priceMax'
                          value={formatNumber(priceMax)}
                          onChange={(e) => {
                            handleInputNumberChange(e);
                            formatAndPreserveCursor(e);
                          }}
                          placeholder='Đến'
                        />
                        <p className='w-1/12 p-2'>VND</p>
                      </div>
                    </div>
                    <button
                      className='ml-auto w-max text-blue-400 font-semibold'
                      onClick={() => {
                        setIsOpenFilter(false);
                        removeValueQueryString(['minPrice', 'maxPrice']);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            <div className='w-full flex justify-end gap-4'>
              <button
                className='px-6 py-2 border border-neutral-300 text-sm font-bold rounded-sm'
                onClick={handleDeleteAll}
              >
                Xóa tất cả
              </button>
              <button
                className='px-6 py-2 bg-red-500 text-neutral-50 border border-red-500 rounded-sm'
                onClick={handleSort}
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}
      </div>
      {!isLoadingProducts && productsData && (
        <div className='w-full flex justify-center'>
          <h3 className='text-lg text-start font-medium tracking-[2px]'>
            Hiển thị {productsData?.from || 0}-{productsData?.to || 0} trên{' '}
            {productsData?.total} kết quả
          </h3>
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
              Hiện chưa có sản phẩm!
            </p>
          </div>
        )}
    </section>
  );
}

export default ProductsMobile;
