'use client';
import { defaultCountry } from '@/config/config';
import { ModalContext } from '@/contexts/ModalProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
} from '@/lib/redux/query/countryQuery';
import { usePostAddressMutation } from '@/lib/redux/query/userQuery';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
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
  full_name_en: string;
};
type Form = {
  province: {
    code: string;
    full_name: string;
    full_name_en: string;
  };
  district: {
    code: string;
    full_name: string;
    full_name_en: string;
  };
  ward: {
    code: string;
    full_name: string;
    full_name_en: string;
  };
  address_detail: string;
  default: boolean;
  type: null | number;
};
function AddAddressModal() {
  const { locale } = useParams();
  const t = useTranslations('common');
  const { state, setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [country, setCountry] = useState<Form>({
    province: {
      code: '',
      full_name: '',
      full_name_en: '',
    },
    district: {
      code: '',
      full_name: '',
      full_name_en: '',
    },
    ward: {
      code: '',
      full_name: '',
      full_name_en: '',
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
    postAddress,
    {
      isLoading: isLoadingPost,
      isSuccess: isSuccessPost,
      isError: isErrorPost,
      error: errorPost,
    },
  ] = usePostAddressMutation();
  const errors = useMemo(() => {
    if (isErrorPost && errorPost) {
      const error = errorPost as any;
      return {
        errors: error?.data?.errors,
        message: error?.data?.message,
      };
    }
    return null;
  }, [isErrorPost, errorPost]);
  const handleChangeTab = useCallback((tab: string) => {
    setCurTab((prevTab) => {
      if (tab === prevTab) return null;
      return tab;
    });
  }, []);
  const handleSelectCountry = useCallback(
    (full_name: string, full_name_en: string, value: string, code: string) => {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          [full_name]: {
            full_name: value,
            full_name_en: full_name_en,
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
                handleSelectCountry(
                  'province',
                  p?.full_name_en,
                  p?.full_name,
                  p?.id
                )
              }
              disabled={isLoadingPost}
            >
              {locale === 'vi' ? p?.full_name : p?.full_name_en}
            </button>
          </li>
        );
      })
    );
  }, [
    isSuccessProvinces,
    provincesData,
    isLoadingPost,
    locale,
    handleSelectCountry,
  ]);
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
                handleSelectCountry(
                  'district',
                  d?.full_name_en,
                  d?.full_name,
                  d?.id
                )
              }
              disabled={isLoadingPost}
            >
              {locale === 'vi' ? d?.full_name : d?.full_name_en}
            </button>
          </li>
        );
      })
    );
  }, [
    isSuccessDistricts,
    districtsData,
    isLoadingPost,
    locale,
    handleSelectCountry,
  ]);
  const renderedWards = useMemo(() => {
    return (
      isSuccessWards &&
      wardsData?.data?.map((w: PartOfCountry) => {
        return (
          <li className='w-full' key={w?.id}>
            <button
              className='text-sm md:text-base w-full px-4 py-2 hover:bg-neutral-100 transition-colors text-start'
              type='button'
              onClick={() =>
                handleSelectCountry(
                  'ward',
                  w?.full_name_en,
                  w?.full_name,
                  w?.id
                )
              }
              disabled={isLoadingPost}
            >
              {locale === 'vi' ? w?.full_name : w?.full_name_en}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessWards, wardsData, isLoadingPost, locale, handleSelectCountry]);
  useEffect(() => {
    if (!state.visibleAddAddressModal) {
      setCountry({
        province: {
          code: '',
          full_name: '',
          full_name_en: '',
        },
        district: {
          code: '',
          full_name: '',
          full_name_en: '',
        },
        ward: {
          code: '',
          full_name: '',
          full_name_en: '',
        },
        address_detail: '',
        default: false,
        type: null,
      });
    }
  }, [state.visibleAddAddressModal]);
  useLayoutEffect(() => {
    if (country.province.code) {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          district: {
            code: '',
            full_name: '',
            full_name_en: '',
          },
          ward: {
            code: '',
            full_name: '',
            full_name_en: '',
          },
        };
      });
    }
  }, [country.province.code]);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await postAddress({
        default: country.default,
        type: country.type,
        country: defaultCountry,
        province: country.province.full_name,
        district: country.district.full_name,
        ward: country.ward.full_name,
        address_detail: country.address_detail,
      });
    },
    [postAddress, country]
  );
  useEffect(() => {
    if (isLoadingPost) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingPost, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessPost) {
      setVisibleModal('visibleAddAddressModal');
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('mess_add_address'),
        },
      });
    }
    if (isErrorPost && errorPost) {
      const error = errorPost as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessPost,
    isErrorPost,
    errorPost,
    setVisiblePopup,
    setVisibleModal,
    t,
  ]);
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
          <h1 className='text-lg md:text-xl font-bold'>{t('add_address')}</h1>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='relative w-full'>
            <button
              className='text-sm md:text-base w-full border border-neutral-400 rounded-sm px-4 py-2 text-start'
              type='button'
              onClick={() => handleChangeTab('provinces')}
              disabled={isLoadingPost}
            >
              {country?.province?.full_name
                ? locale === 'vi'
                  ? country.province.full_name
                  : country.province.full_name_en
                : t('select_province')}
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
                  {t('select_province')}
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
              disabled={isLoadingPost}
            >
              {country?.district?.full_name
                ? locale === 'vi'
                  ? country.district.full_name
                  : country.district.full_name_en
                : t('select_district')}
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
                  {t('select_district')}
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
              disabled={isLoadingPost}
            >
              {country?.ward?.full_name
                ? locale === 'vi'
                  ? country.ward.full_name
                  : country.ward.full_name_en
                : t('select_ward')}
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
                  {t('select_ward')}
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
              placeholder={`${t('address_details')}...`}
              value={country.address_detail}
              onChange={(e) =>
                setCountry({ ...country, address_detail: e.target.value })
              }
              disabled={isLoadingPost}
            />
            {errors?.errors.address_detail && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.errors.address_detail[0]}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-sm md:text-base'>{t('type_of_address')}:</p>
          <div className='flex items-center gap-4'>
            <button
              className={`text-sm md:text-base border ${
                country.type === 0
                  ? 'border-red-500 text-red-500'
                  : 'border-neutral-300'
              } rounded-sm px-4 py-1`}
              type='button'
              onClick={() => setCountry({ ...country, type: 0 })}
              disabled={isLoadingPost}
            >
              {t('type_home')}
            </button>
            <button
              className={`text-sm md:text-base border ${
                country.type === 1
                  ? 'border-red-500 text-red-500'
                  : 'border-neutral-300'
              } rounded-sm px-4 py-1`}
              type='button'
              onClick={() => setCountry({ ...country, type: 1 })}
              disabled={isLoadingPost}
            >
              {t('type_office')}
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
              setCountry({ ...country, default: !country.default })
            }
            disabled={isLoadingPost}
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
            <p>{t('set_default_address')}</p>
          </button>
        </div>
        <div className='w-full flex justify-end items-center gap-4'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={() => setVisibleModal('visibleAddAddressModal')}
            disabled={isLoadingPost}
          >
            {t('return')}
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            disabled={isLoadingPost}
          >
            {t('complete')}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddAddressModal;
