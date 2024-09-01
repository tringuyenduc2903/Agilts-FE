'use client';
import CustomRadio from '@/components/ui/form/CustomRadio';
import useClickOutside from '@/lib/hooks/useClickOutside';
import useQueryString from '@/lib/hooks/useQueryString';
import {
  convertData,
  formatAndPreserveCursor,
  formatNumber,
} from '@/lib/utils/format';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
type Filter = any;
function FilterSection({ filter, isSuccessFilter, closeFilter }: Filter) {
  const searchParams = useSearchParams();
  const [createQueryString, removeValueQueryString, deleteQueryString] =
    useQueryString();
  const sectionRef = useClickOutside(closeFilter);
  const [showFilters, setShowFilters] = useState({
    manufacturer: false,
    option_type: false,
    version: false,
    color: false,
    volume: false,
  });
  const [form, setForm] = useState({
    manufacturer: '',
    option_type: '',
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
  useEffect(() => {
    if (searchParams) {
      setForm((prevForm) => {
        return {
          ...prevForm,
          manufacturer: searchParams.get('manufacturer') || '',
          option_type: searchParams.get('option_type') || '',
          version: {
            name: prevForm.version.name,
            value: searchParams.get('version') || '',
          },
          color: {
            name: prevForm.color.name,
            value: searchParams.get('color') || '',
          },
          volume: {
            name: prevForm.volume.name,
            value: searchParams.get('volume') || '',
          },
        };
      });
    }
  }, [searchParams]);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(0);
  const renderedManufacturer = useMemo(() => {
    return (
      (isSuccessFilter &&
        filter?.manufacturer &&
        convertData(filter?.manufacturer?.data)?.map((d) => {
          return (
            <button
              className='flex items-center gap-4'
              key={d.id}
              onClick={() =>
                setForm((prevForm) => {
                  return {
                    ...prevForm,
                    manufacturer: d.id,
                  };
                })
              }
            >
              <CustomRadio
                cb={() =>
                  setForm((prevForm) => {
                    return {
                      ...prevForm,
                      manufacturer: d.id,
                    };
                  })
                }
                isCheck={
                  searchParams.get(filter?.manufacturer?.name) === d.id ||
                  form.manufacturer === d.id
                }
              />
              <span className='font-medium'>{d?.value}</span>
            </button>
          );
        })) ||
      []
    );
  }, [isSuccessFilter, filter?.manufacturer, form.manufacturer, searchParams]);
  const renderedOptionType = useMemo(() => {
    return (
      (isSuccessFilter &&
        filter?.option_type &&
        filter?.option_type?.data?.map((d: string) => {
          return (
            <button
              className='flex items-center gap-4'
              key={d}
              onClick={() =>
                setForm((prevForm) => {
                  return {
                    ...prevForm,
                    option_type: d,
                  };
                })
              }
            >
              <CustomRadio
                cb={() =>
                  setForm((prevForm) => {
                    return {
                      ...prevForm,
                      option_type: d,
                    };
                  })
                }
                isCheck={
                  searchParams.get(filter?.option_type?.name) === d ||
                  form.option_type === d
                }
              />
              <span className='font-medium'>{d}</span>
            </button>
          );
        })) ||
      []
    );
  }, [isSuccessFilter, filter?.option_type, form.option_type, searchParams]);
  const renderedVersion = useMemo(() => {
    return (
      (isSuccessFilter &&
        filter?.version &&
        convertData(filter?.version?.data)?.map((d) => {
          return (
            <button
              className='flex items-center gap-4'
              key={d.id}
              onClick={() =>
                setForm((prevForm) => {
                  return {
                    ...prevForm,
                    version: {
                      name: filter?.version?.name,
                      value: d.id,
                    },
                  };
                })
              }
            >
              <CustomRadio
                cb={() =>
                  setForm((prevForm) => {
                    return {
                      ...prevForm,
                      version: {
                        name: filter?.version?.name,
                        value: d.id,
                      },
                    };
                  })
                }
                isCheck={
                  searchParams.get(filter?.version?.name) === d.id ||
                  form.version.value === d.id
                }
              />
              <span className='font-medium'>{d?.value}</span>
            </button>
          );
        })) ||
      []
    );
  }, [isSuccessFilter, filter?.version, form.version, searchParams]);
  const renderedColor = useMemo(() => {
    return (
      (isSuccessFilter &&
        filter?.color &&
        convertData(filter?.color?.data)?.map((d) => {
          return (
            <button
              className='flex items-center gap-4'
              key={d.id}
              onClick={() =>
                setForm((prevForm) => {
                  return {
                    ...prevForm,
                    color: {
                      name: filter?.color?.name,
                      value: d.id,
                    },
                  };
                })
              }
            >
              <CustomRadio
                cb={() =>
                  setForm((prevForm) => {
                    return {
                      ...prevForm,
                      color: {
                        name: filter?.color?.name,
                        value: d.id,
                      },
                    };
                  })
                }
                isCheck={
                  searchParams.get(filter?.color?.name) === d.id ||
                  form.color.value === d.id
                }
              />
              <span className='font-medium'>{d?.value}</span>
            </button>
          );
        })) ||
      []
    );
  }, [isSuccessFilter, filter?.color, form.color, searchParams]);
  const renderedVolume = useMemo(() => {
    return (
      (isSuccessFilter &&
        filter?.volume &&
        convertData(filter?.volume?.data)?.map((d) => {
          return (
            <button
              className='flex items-center gap-4'
              key={d.id}
              onClick={() =>
                setForm((prevForm) => {
                  return {
                    ...prevForm,
                    volume: {
                      name: filter?.volume?.name,
                      value: d.id,
                    },
                  };
                })
              }
            >
              <CustomRadio
                cb={() =>
                  setForm((prevForm) => {
                    return {
                      ...prevForm,
                      volume: {
                        name: filter?.volume?.name,
                        value: d.id,
                      },
                    };
                  })
                }
                isCheck={
                  searchParams.get(filter?.volume?.name) === d.id ||
                  form.volume.value === d.id
                }
              />
              <span className='font-medium'>{d?.value}</span>
            </button>
          );
        })) ||
      []
    );
  }, [isSuccessFilter, filter?.volume, form.volume, searchParams]);
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
  const handleSort = useCallback(() => {
    closeFilter();
    createQueryString(
      [
        'manufacturer',
        'option_type',
        form.version.name,
        form.color.name,
        form.volume.name,
        'minPrice',
        'maxPrice',
      ],
      [
        form.manufacturer,
        form.option_type,
        form.version.value,
        form.color.value,
        form.volume.value,
        priceMin.toString(),
        priceMax.toString(),
      ]
    );
  }, [closeFilter, createQueryString, priceMin, priceMax, form]);
  const handleDeleteQueryString = useCallback(() => {
    closeFilter();
    setForm((prevForm) => {
      return {
        ...prevForm,
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
        priceMin: 0,
        priceMax: 0,
      };
    }),
      deleteQueryString(false);
  }, [closeFilter, deleteQueryString]);
  return (
    <section
      ref={sectionRef}
      className='fixed top-0 left-0 w-full h-full z-[9999] flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='relative w-1/2 2xl:w-1/3 h-5/6 bg-white rounded-sm overflow-hidden'>
        <div className='py-6 border-b border-neutral-300 flex justify-between items-center gap-4 px-4'>
          <div className='flex-1 flex justify-center items-center'>
            <h1 className='text-xl font-bold'>Tìm kiếm nâng cao</h1>
          </div>
          <button
            className='w-max'
            aria-label='close-filter'
            onClick={closeFilter}
          >
            <FaXmark className='text-2xl text-neutral-500' />
          </button>
        </div>
        <div className='px-4 pb-[192px] h-full overflow-y-auto'>
          {filter.manufacturer && (
            <div className='py-6 border-b border-neutral-300 flex flex-col gap-4'>
              <h2 className='text-lg font-bold'>
                {filter?.manufacturer?.label}
              </h2>
              <div
                style={{
                  height: showFilters.manufacturer
                    ? `${renderedManufacturer?.length * 32 + 32}px`
                    : '124px',
                }}
                className={`flex flex-col gap-2 transition-all duration-150 overflow-hidden`}
              >
                <button
                  className='flex items-center gap-4'
                  onClick={() =>
                    setForm({
                      ...form,
                      manufacturer: '',
                    })
                  }
                >
                  <CustomRadio
                    cb={() =>
                      setForm({
                        ...form,
                        manufacturer: '',
                      })
                    }
                    isCheck={!form.manufacturer}
                  />
                  <span className='font-medium'>Tất cả</span>
                </button>
                {renderedManufacturer}
              </div>
              {renderedManufacturer?.length > 3 && (
                <button
                  className='w-max underline'
                  onClick={() =>
                    setShowFilters({
                      ...showFilters,
                      manufacturer: !showFilters.manufacturer,
                    })
                  }
                >
                  {showFilters.manufacturer ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}
          {filter.option_type && (
            <div className='py-6 border-b border-neutral-300 flex flex-col gap-4'>
              <h2 className='text-lg font-bold'>
                {filter?.option_type?.label}
              </h2>
              <div
                style={{
                  height: showFilters.option_type
                    ? `${renderedOptionType?.length * 32 + 32}px`
                    : '124px',
                }}
                className={`flex flex-col gap-2 transition-all duration-150 overflow-hidden`}
              >
                <button
                  className='flex items-center gap-4'
                  onClick={() =>
                    setForm((prevForm) => {
                      return {
                        ...prevForm,
                        option_type: '',
                      };
                    })
                  }
                >
                  <CustomRadio
                    cb={() =>
                      setForm((prevForm) => {
                        return {
                          ...prevForm,
                          option_type: '',
                        };
                      })
                    }
                    isCheck={!form.option_type}
                  />
                  <span className='font-medium'>Tất cả các loại sản phẩm</span>
                </button>
                {renderedOptionType}
              </div>
              {renderedOptionType?.length > 3 && (
                <button
                  className='w-max underline'
                  onClick={() =>
                    setShowFilters({
                      ...showFilters,
                      option_type: !showFilters.option_type,
                    })
                  }
                >
                  {showFilters.option_type ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}
          {filter.version && (
            <div className='py-6 border-b border-neutral-300 flex flex-col gap-4'>
              <h2 className='text-lg font-bold'>{filter?.version?.label}</h2>
              <div
                style={{
                  height: showFilters.version
                    ? `${renderedVersion?.length * 32 + 32}px`
                    : '124px',
                }}
                className={`flex flex-col gap-2 transition-all duration-150 overflow-hidden`}
              >
                <button
                  className='flex items-center gap-4'
                  onClick={() =>
                    setForm({
                      ...form,
                      version: {
                        name: '',
                        value: '',
                      },
                    })
                  }
                >
                  <CustomRadio
                    cb={() =>
                      setForm({
                        ...form,
                        version: {
                          name: '',
                          value: '',
                        },
                      })
                    }
                    isCheck={!form.version.value}
                  />
                  <span className='font-medium'>Tất cả phiên bản</span>
                </button>
                {renderedVersion}
              </div>
              {renderedVersion?.length > 3 && (
                <button
                  className='w-max underline'
                  onClick={() =>
                    setShowFilters({
                      ...showFilters,
                      version: !showFilters.version,
                    })
                  }
                >
                  {showFilters.version ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}
          {filter.color && (
            <div className='py-6 border-b border-neutral-300 flex flex-col gap-4'>
              <h2 className='text-lg font-bold'>{filter?.color?.label}</h2>
              <div
                style={{
                  height: showFilters.color
                    ? `${renderedColor?.length * 32 + 32}px`
                    : '124px',
                }}
                className={`flex flex-col gap-2 transition-all duration-150 overflow-hidden`}
              >
                <button
                  className='flex items-center gap-4'
                  onClick={() =>
                    setForm((prevForm) => {
                      return {
                        ...prevForm,
                        color: {
                          name: '',
                          value: '',
                        },
                      };
                    })
                  }
                >
                  <CustomRadio
                    cb={() =>
                      setForm((prevForm) => {
                        return {
                          ...prevForm,
                          color: {
                            name: '',
                            value: '',
                          },
                        };
                      })
                    }
                    isCheck={!form.color.value}
                  />
                  <span className='font-medium'>Tất cả màu sắc</span>
                </button>
                {renderedColor}
              </div>
              {renderedColor?.length > 3 && (
                <button
                  className='w-max underline'
                  onClick={() =>
                    setShowFilters({
                      ...showFilters,
                      color: !showFilters.color,
                    })
                  }
                >
                  {showFilters.color ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}
          {filter.volume && (
            <div className='py-6 border-b border-neutral-300 flex flex-col gap-4'>
              <h2 className='text-lg font-bold'>{filter?.volume?.label}</h2>
              <div
                style={{
                  height: showFilters.volume
                    ? `${renderedVolume?.length * 32 + 32}px`
                    : '124px',
                }}
                className={`flex flex-col gap-2 transition-all duration-150 overflow-hidden`}
              >
                <button
                  className='flex items-center gap-4'
                  onClick={() =>
                    setForm((prevForm) => {
                      return {
                        ...prevForm,
                        volume: {
                          name: '',
                          value: '',
                        },
                      };
                    })
                  }
                >
                  <CustomRadio
                    cb={() =>
                      setForm((prevForm) => {
                        return {
                          ...prevForm,
                          volume: {
                            name: '',
                            value: '',
                          },
                        };
                      })
                    }
                    isCheck={!form.volume.value}
                  />
                  <span className='font-medium'>Tất cả dung tích</span>
                </button>
                {renderedVolume}
              </div>
              {renderedVolume?.length > 3 && (
                <button
                  className='w-max underline'
                  onClick={() =>
                    setShowFilters({
                      ...showFilters,
                      volume: !showFilters.volume,
                    })
                  }
                >
                  {showFilters.volume ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}
          {filter?.minPrice?.data?.raw && filter?.maxPrice?.data?.raw && (
            <div className='w-full py-6 flex flex-col gap-8'>
              <h2 className='text-lg font-bold'>Giá tiền</h2>
              <div className='h-max flex justify-between items-center gap-4'>
                <div className='relative max-w-[220px] w-full border border-neutral-300 rounded-sm flex justify-between items-center'>
                  <p className='absolute -top-3/4 text-neutral-500'>
                    Từ ({filter?.minPrice?.data?.preview})
                  </p>
                  <input
                    className='w-4/5 px-4 py-2 border-r border-neutral-300'
                    type='text'
                    name='priceMin'
                    value={formatNumber(priceMin)}
                    onChange={(e) => {
                      handleInputNumberChange(e);
                      formatAndPreserveCursor(e);
                    }}
                    placeholder='Từ'
                  />
                  <p className='w-1/5 p-2'>VND</p>
                </div>
                <span className='relative w-[24px] h-full before:absolute before:w-full before:h-[2px] before:bg-neutral-500'></span>
                <div className='relative max-w-[220px] w-full border border-neutral-300 rounded-sm flex justify-between items-center'>
                  <p className='absolute -top-3/4 text-neutral-500'>
                    Đến ({filter?.maxPrice?.data?.preview})
                  </p>
                  <input
                    className='w-4/5 px-4 py-2 border-r border-neutral-300'
                    type='text'
                    name='priceMax'
                    value={formatNumber(priceMax)}
                    onChange={(e) => {
                      handleInputNumberChange(e);
                      formatAndPreserveCursor(e);
                    }}
                    placeholder='Đến'
                  />
                  <p className='w-1/5 p-2'>VND</p>
                </div>
                <button
                  className='text-blue-400 font-semibold'
                  onClick={() => {
                    closeFilter();
                    removeValueQueryString(['minPrice', 'maxPrice']);
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
        </div>
        <div className='absolute bottom-0 left-0 w-full h-max z-10 bg-white px-4 py-6 border-t border-neutral-300 flex justify-between items-center gap-6'>
          <button
            className={`px-6 py-2 border border-neutral-500 text-neutral-800 font-semibold ${
              searchParams.toString()
                ? 'cursor-pointer'
                : 'cursor-not-allowed opacity-50'
            }`}
            disabled={!searchParams.toString()}
            onClick={handleDeleteQueryString}
          >
            Xóa tất cả
          </button>
          <button
            className='px-6 py-2 border border-red-500 bg-red-600 text-white font-semibold'
            onClick={handleSort}
          >
            Áp dụng
          </button>
        </div>
      </div>
    </section>
  );
}

export default FilterSection;
