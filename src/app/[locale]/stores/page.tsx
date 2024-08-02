'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaAngleDown } from 'react-icons/fa6';
import { useGetStoresQuery } from '@/lib/redux/query/storesQuery';
import { Branch, SingleImage } from '@/types/types';
import { TiLocationOutline, TiPhoneOutline } from 'react-icons/ti';
import CustomPaginationV2 from '@/components/ui/CustomPaginationV2';
import { useParams, useSearchParams } from 'next/navigation';
import NotFoundItem from '@/components/ui/NotFoundItem';
import {
  useGetDistrictsQuery,
  useGetProvincesQuery,
} from '@/lib/redux/query/countryQuery';
import useQueryString from '@/lib/hooks/useQueryString';
import { defaultCountry } from '@/config/config';
import LoadingMultiItem from '@/components/ui/LoadingMultiItem';
import CustomImage from '@/components/ui/CustomImage';
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
};
function StoresPage() {
  const t = useTranslations('common');
  const { locale } = useParams();
  const searchPrams = useSearchParams();
  const [createQueryString, _, deleteQueryString] = useQueryString();
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
  });
  const [curTab, setCurTab] = useState<string | null>(null);
  const {
    data: branchData,
    isSuccess: isSuccessBranch,
    isLoading: isLoadingBranch,
    isFetching: isFetchingBranch,
    isError: isErrorBranch,
  } = useGetStoresQuery(searchPrams.toString());
  const { data: provincesData, isSuccess: isSuccessProvinces } =
    useGetProvincesQuery(null);
  const { data: districtsData, isSuccess: isSuccessDistricts } =
    useGetDistrictsQuery(country.province.code, {
      skip: !country.province.code,
    });
  useEffect(() => {
    if (country.province.code) {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          district: {
            code: '',
            full_name: '',
            full_name_en: '',
          },
        };
      });
    }
  }, [country.province.code]);
  const handleSelectCountry = useCallback(
    (name: string, name_en: string, value: string, code: string) => {
      setCountry((prevCountry) => {
        return {
          ...prevCountry,
          [name]: {
            full_name: value,
            full_name_en: name_en,
            code: code,
          },
        };
      });
      setCurTab(null);
    },
    []
  );
  const handleChangeTab = useCallback((tab: string) => {
    setCurTab((prevTab) => {
      if (tab === prevTab) return null;
      return tab;
    });
  }, []);
  const handleSearch = useCallback(() => {
    createQueryString(
      ['country', 'province', 'district'],
      [defaultCountry, country.province.full_name, country.district.full_name]
    );
  }, [createQueryString, country]);
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
            >
              {p?.full_name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessProvinces, provincesData, handleSelectCountry]);
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
            >
              {d?.full_name}
            </button>
          </li>
        );
      })
    );
  }, [isSuccessDistricts, districtsData, handleSelectCountry]);
  const renderedBranch = useMemo(() => {
    return (
      isSuccessBranch &&
      branchData?.data?.length > 0 &&
      branchData?.data?.map((b: Branch) => {
        return (
          <article className='col-span-1 flex flex-col gap-2' key={b.id}>
            <div className='max-h-[350px] h-full overflow-hidden'>
              <CustomImage
                className='object-cover w-full h-full'
                image={b.image ? b.image : ({} as SingleImage)}
                width={500}
                height={300}
              />
            </div>
            <h2 className='text-lg md:text-xl font-bold'>{b?.name}</h2>
            <div className='flex items-center gap-2'>
              <TiLocationOutline className='text-2xl text-red-500' />
              <p
                title={b?.address?.address_preview}
                className='line-clamp-1 font-medium'
              >
                {b?.address?.address_preview}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <TiPhoneOutline className='text-2xl text-red-500' />
              <a
                title={b?.phone_number as string}
                className='line-clamp-1 font-medium'
                id='phone'
                href={`tel:${b?.phone_number}`}
              >
                {b?.phone_number}
              </a>
            </div>
          </article>
        );
      })
    );
  }, [branchData, isSuccessBranch]);
  if (isErrorBranch) throw new Error();
  return (
    <main className='w-full py-[72px] flex flex-col gap-16'>
      <section className='absolute h-[380px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[380px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <h1 className='text-red-600 font-bold tracking-[8px]'>
          {t('performance')}
        </h1>
        <p className='text-center md:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
          {t('stores')}
        </p>
      </section>
      <section className='px-4 md:px-16'>
        <div className='bg-neutral-100 p-8 grid grid-cols-1 lg:grid-cols-8 xl:grid-cols-12 gap-6 text-sm md:text-base'>
          <p className='col-span-1 lg:col-span-2 h-full flex items-center'>
            {t('search_store')}:
          </p>
          <div className='relative h-[40px] col-span-1 lg:col-span-2 xl:col-span-4'>
            <button
              className='w-full h-full rounded-sm bg-white px-4 py-1 border border-neutral-400 text-sm md:text-base flex justify-between items-center'
              name='province'
              onClick={() => handleChangeTab('provinces')}
            >
              <p>
                {country?.province?.full_name
                  ? locale === 'vi'
                    ? country.province.full_name
                    : country.province.full_name_en
                  : t('select_province')}
              </p>
              <FaAngleDown />
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-50 border-neutral-400 ${
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
          </div>
          <div className='relative  h-[40px] col-span-1 lg:col-span-2 xl:col-span-4'>
            <button
              className='w-full h-full rounded-sm bg-white px-4 py-1 border border-neutral-400 text-sm md:text-base flex justify-between items-center'
              name='district'
              onClick={() => handleChangeTab('districts')}
            >
              <p>
                {country?.district?.full_name
                  ? locale === 'vi'
                    ? country.district.full_name
                    : country.district.full_name_en
                  : t('select_district')}
              </p>
              <FaAngleDown />
            </button>
            <ul
              className={`absolute top-[110%] left-0 w-full bg-white z-50 border-neutral-400 ${
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
          </div>
          <button
            className='col-span-1 h-[40px] font-bold py-2 border border-neutral-500 bg-white rounded-sm text-sm md:text-base'
            onClick={() => deleteQueryString()}
          >
            {t('delete')}
          </button>
          <button
            className='col-span-1 h-[40px] font-bold py-2 bg-neutral-800 text-white rounded-sm text-sm md:text-base'
            onClick={handleSearch}
          >
            {t('search')}
          </button>
        </div>
      </section>
      <section className='w-full px-4 md:px-16 flex flex-col gap-16'>
        {!isLoadingBranch &&
          !isFetchingBranch &&
          (renderedBranch ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
              {renderedBranch}
            </div>
          ) : (
            <div className='w-full flex justify-center items-center'>
              <NotFoundItem message={t('no_store')} />
            </div>
          ))}
        {(isLoadingBranch || isFetchingBranch) && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
            <LoadingMultiItem customClass='col-span-1 h-[400px] skeleton' />
          </div>
        )}
        <div className='flex justify-center lg:justify-start'>
          {isSuccessBranch && Number(branchData?.total_pages) > 1 && (
            <CustomPaginationV2
              scroll={true}
              totalPage={Number(branchData?.total_pages)}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default StoresPage;
