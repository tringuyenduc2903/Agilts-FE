'use client';
import { ModalContext } from '@/contexts/ModalProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import { useUpdateAddressMutation } from '@/lib/redux/query/appQuery';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from '@/lib/redux/query/countryQuery';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { FaCheck } from 'react-icons/fa6';
type PartOfCountry = {
  id: string;
  full_name: string;
};
type Form = {
  province: {
    code: string;
    full_name: string;
  };
  district: {
    code: string;
    full_name: string;
  };
  ward: {
    code: string;
    full_name: string;
  };
  address_detail: string;
  default: boolean;
  type: null | number;
};
function UpdateAddressModal() {
  const { state, setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [country, setCountry] = useState<Form>({
    province: {
      code: '',
      full_name: '',
    },
    district: {
      code: '',
      full_name: '',
    },
    ward: {
      code: '',
      full_name: '',
    },
    address_detail: '',
    default: false,
    type: null,
  });
  const [curTab, setCurTab] = useState<string | null>(null);
  const { data: provincesData, isSuccess: isSuccessProvinces } =
    useGetProvincesQuery(null);
  const { data: districtsData, isSuccess: isSuccessDistricts } =
    useGetDistrictsQuery(country.province.code, {
      skip: !country.province.code,
    });
  const { data: wardsData, isSuccess: isSuccessWards } = useGetWardsQuery(
    country.district.code,
    { skip: !country.district.code }
  );
  const [
    updateAddress,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateAddressMutation();
  const errors = useMemo(() => {
    if (isErrorUpdate && errorUpdate) {
      const error = (errorUpdate as any).data;
      return {
        errors: error?.errors,
        message: error?.message,
      };
    }
    return null;
  }, [isErrorUpdate, errorUpdate]);
  const handleChangeTab = useCallback((tab: string) => {
    setCurTab((prevTab) => {
      if (tab === prevTab) return null;
      return tab;
    });
  }, []);
  const handleSelectCountry = useCallback(
    (full_name: string, value: string, code: string) => {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          [full_name]: {
            full_name: value,
            code: code,
          },
        };
      });
      setCurTab(null);
    },
    []
  );
  const renderedProvinces = useMemo(() => {
    return (
      isSuccessProvinces &&
      provincesData?.data?.map((p: PartOfCountry) => {
        return (
          <li className='w-full' key={p?.id}>
            <button
              className='text-sm md:text-base w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
              type='button'
              onClick={() =>
                handleSelectCountry('province', p?.full_name, p?.id)
              }
              disabled={isLoadingUpdate}
            >
              {p?.full_name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessProvinces, provincesData, isLoadingUpdate, handleSelectCountry]);
  const renderedDistricts = useMemo(() => {
    return (
      isSuccessDistricts &&
      districtsData?.data?.map((d: PartOfCountry) => {
        return (
          <li className='w-full' key={d?.id}>
            <button
              className='text-sm md:text-base w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
              type='button'
              onClick={() =>
                handleSelectCountry('district', d?.full_name, d?.id)
              }
              disabled={isLoadingUpdate}
            >
              {d?.full_name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessDistricts, districtsData, isLoadingUpdate, handleSelectCountry]);
  const renderedWards = useMemo(() => {
    return (
      isSuccessWards &&
      wardsData?.data?.map((w: PartOfCountry) => {
        return (
          <li className='w-full' key={w?.id}>
            <button
              className='text-sm md:text-base w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
              type='button'
              onClick={() => handleSelectCountry('ward', w?.full_name, w?.id)}
              disabled={isLoadingUpdate}
            >
              {w?.full_name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessWards, wardsData, isLoadingUpdate, handleSelectCountry]);
  useEffect(() => {
    if (state.visibleUpdateAddressModal) {
      setCountry({
        province: {
          code: '',
          full_name: state.visibleUpdateAddressModal.province,
        },
        district: {
          code: '',
          full_name: state.visibleUpdateAddressModal.district,
        },
        ward: {
          code: '',
          full_name: state.visibleUpdateAddressModal.ward,
        },
        address_detail: state.visibleUpdateAddressModal.address_detail,
        default: state.visibleUpdateAddressModal.default,
        type: state.visibleUpdateAddressModal.type,
      });
    } else {
      setCountry({
        province: {
          code: '',
          full_name: '',
        },
        district: {
          code: '',
          full_name: '',
        },
        ward: {
          code: '',
          full_name: '',
        },
        address_detail: '',
        default: false,
        type: null,
      });
    }
  }, [state.visibleUpdateAddressModal]);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await updateAddress({
        body: { ...country, default: !country.default },
        id: state?.visibleUpdateAddressModal.id,
      });
    },
    [updateAddress, country, state?.visibleUpdateAddressModal]
  );
  useEffect(() => {
    if (isLoadingUpdate) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingUpdate, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessUpdate) {
      setVisibleModal('visibleUpdateAddressModal');
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Cập nhật địa chỉ thành công!',
        },
      });
    }
    if (isErrorUpdate && errorUpdate) {
      const error = errorUpdate as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessUpdate,
    isErrorUpdate,
    errorUpdate,
    setVisiblePopup,
    setVisibleModal,
  ]);
  useLayoutEffect(() => {
    if (country.province.code) {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          district: {
            code: '',
            full_name: '',
          },
          ward: {
            code: '',
            full_name: '',
          },
        };
      });
    }
  }, [country.province.code]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <form
        method='POST'
        className='bg-white text-neutral-800 text-sm md:text-base px-4 py-8 rounded-sm flex flex-col gap-6 min-h-[40vh] max-h-[80vh] w-full sm:w-3/4 md:w-2/3 xl:w-1/2 overflow-y-auto'
        onSubmit={handleSubmit}
      >
        <div className='flex justify-between gap-4'>
          <h1 className='text-lg md:text-xl font-bold'>Cập nhật địa chỉ</h1>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='relative w-full'>
            <button
              className='text-sm md:text-base w-full border border-neutral-400 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => handleChangeTab('provinces')}
              disabled={isLoadingUpdate}
            >
              {country?.province?.full_name
                ? country.province.full_name
                : 'Tỉnh/Thành phố'}
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-10 border-neutral-400 ${
                curTab === 'provinces' ? 'h-[364px] border' : 'h-0'
              } transition-[height] duration-150 overflow-y-auto`}
            >
              <li className='w-full'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start cursor-not-allowed'
                  type='button'
                  disabled
                >
                  Tỉnh/Thành phố
                </button>
              </li>
              {renderedProvinces}
            </ul>
            {errors?.errors.province && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.province[0]}
              </p>
            )}
          </div>
          <div className='relative w-full'>
            <button
              className='text-sm md:text-base w-full border border-neutral-400 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => handleChangeTab('districts')}
              disabled={isLoadingUpdate}
            >
              {country?.district?.full_name
                ? country.district.full_name
                : 'Quận/Huyện'}
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-10 border-neutral-400 ${
                curTab === 'districts'
                  ? isSuccessDistricts
                    ? 'h-[364px] border'
                    : 'h-[40px] border'
                  : 'h-0'
              } transition-[height] duration-150 overflow-y-auto`}
            >
              <li className='w-full'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start cursor-not-allowed'
                  type='button'
                  disabled
                >
                  Quận/Huyện
                </button>
              </li>
              {renderedDistricts}
            </ul>
            {errors?.errors.district && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.district[0]}
              </p>
            )}
          </div>
          <div className='relative w-full'>
            <button
              className='text-sm md:text-base w-full border border-neutral-400 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => handleChangeTab('wards')}
              disabled={isLoadingUpdate}
            >
              {country?.ward?.full_name ? country.ward.full_name : 'Phường/Xã'}
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-10 border-neutral-400 ${
                curTab === 'wards'
                  ? isSuccessWards
                    ? 'h-[364px] border'
                    : 'h-[40px] border'
                  : 'h-0'
              } transition-[height] duration-150 overflow-y-auto`}
            >
              <li className='w-full'>
                <button
                  className='w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start cursor-not-allowed'
                  type='button'
                  disabled
                >
                  Phường/Xã
                </button>
              </li>
              {renderedWards}
            </ul>
            {errors?.errors.ward && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.ward[0]}
              </p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <input
              className='text-sm md:text-base w-full border border-neutral-400 px-4 py-2'
              type='text'
              placeholder='Địa chỉ chi tiết...'
              value={country.address_detail}
              onChange={(e) =>
                setCountry({ ...country, address_detail: e.target.value })
              }
              disabled={isLoadingUpdate}
            />
            {errors?.errors.address_detail && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.address_detail[0]}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm md:text-base'>Loại địa chỉ:</p>
          <div className='flex items-center gap-4'>
            <button
              className={`text-sm md:text-base border ${
                country.type === 0
                  ? 'border-red-500 text-red-500'
                  : 'border-neutral-300'
              } rounded-sm px-4 py-1`}
              type='button'
              onClick={() => setCountry({ ...country, type: 0 })}
              disabled={isLoadingUpdate}
            >
              Nhà riêng
            </button>
            <button
              className={`text-sm md:text-base border ${
                country.type === 1
                  ? 'border-red-500 text-red-500'
                  : 'border-neutral-300'
              } rounded-sm px-4 py-1`}
              type='button'
              onClick={() => setCountry({ ...country, type: 1 })}
              disabled={isLoadingUpdate}
            >
              Văn phòng
            </button>
          </div>
          {errors?.errors.type && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.errors.type[0]}
            </p>
          )}
        </div>
        <div className='w-full'>
          <button
            type='button'
            className='text-sm md:text-base w-max flex justify-start items-center gap-2'
            onClick={() =>
              setCountry((prevCountry) => {
                return { ...prevCountry, default: !country.default };
              })
            }
            disabled={isLoadingUpdate}
          >
            <span
              className={`relative w-[18px] h-[18px] ${
                country.default ? 'bg-red-500' : 'border border-neutral-400'
              } rounded-sm text-white`}
            >
              {country.default && (
                <FaCheck className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2' />
              )}
            </span>
            <p>Đặt làm địa chỉ mặc định</p>
          </button>
        </div>
        <div className='w-full flex justify-end items-center gap-4'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={() => setVisibleModal('visibleUpdateAddressModal')}
            disabled={isLoadingUpdate}
          >
            Trở lại
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            disabled={isLoadingUpdate}
          >
            Hoàn thành
          </button>
        </div>
      </form>
    </section>
  );
}

export default UpdateAddressModal;
