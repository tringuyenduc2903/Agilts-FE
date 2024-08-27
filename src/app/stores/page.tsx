'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { FaAngleDown } from 'react-icons/fa6';
import { useGetStoresQuery } from '@/lib/redux/query/appQuery';
import { Branch, SingleImage } from '@/types/types';
import { TiLocationOutline, TiPhoneOutline } from 'react-icons/ti';
import CustomPaginationV2 from '@/components/ui/CustomPaginationV2';
import { useSearchParams } from 'next/navigation';
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
  } = useGetStoresQuery({ search: searchPrams.toString(), perPage: 12 });
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
            <div className='max-h-[220px] md:max-h-[350px] h-full overflow-hidden'>
              <CustomImage
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
    <main className='w-full py-[72px] flex flex-col gap-16 text-sm md:text-base'>
      <section className='absolute h-[380px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[380px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <p className='text-center md:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
          Hệ thống cửa hàng
        </p>
      </section>
      <section className='px-4 md:px-16 grid lg:grid-cols-3 xl:grid-cols-4 gap-8'>
        <div className='lg:sticky lg:top-[120px] h-max bg-neutral-50 px-4 md:px-8 py-8 md:py-16 text-sm md:text-base flex flex-col gap-6 border border-neutral-500 rounded-sm'>
          <p className='text-lg md:text-xl h-full flex items-center font-medium'>
            Tìm cửa hàng
          </p>
          <div className='flex flex-col gap-2'>
            <p>Chọn tỉnh thành</p>
            <div className='relative h-[40px]'>
              <button
                className='w-full h-full rounded-sm bg-white px-4 py-1 border border-neutral-400 text-sm md:text-base flex justify-between items-center'
                name='province'
                onClick={() => handleChangeTab('provinces')}
              >
                <p>
                  {country?.province?.full_name
                    ? country.province.full_name
                    : 'Tỉnh/Thành phố'}
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
                    Tỉnh/Thành phố
                  </button>
                </li>
                {renderedProvinces}
              </ul>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <p>Chọn quận huyện</p>
            <div className='relative  h-[40px]'>
              <button
                className='w-full h-full rounded-sm bg-white px-4 py-1 border border-neutral-400 text-sm md:text-base flex justify-between items-center'
                name='district'
                onClick={() => handleChangeTab('districts')}
              >
                <p>
                  {country?.district?.full_name
                    ? country.district.full_name
                    : 'Quận/Huyện'}
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
                    Quận/Huyện
                  </button>
                </li>
                {renderedDistricts}
              </ul>
            </div>
          </div>
          <button
            className={`h-[40px] font-bold py-2 border border-neutral-500 bg-white rounded-sm text-sm md:text-base ${
              !searchPrams.toString()
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }`}
            onClick={() => deleteQueryString()}
            disabled={!searchPrams.toString()}
          >
            Xóa
          </button>
          <button
            className='h-[40px] font-bold py-2 bg-neutral-800 text-white rounded-sm text-sm md:text-base'
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
        <div className='lg:col-span-2 xl:col-span-3 w-full flex flex-col gap-16'>
          {!isLoadingBranch &&
            !isFetchingBranch &&
            (renderedBranch ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-16'>
                {renderedBranch}
              </div>
            ) : (
              <div className='w-full flex justify-center items-center'>
                <NotFoundItem message='Hiện chưa có chi nhánh nào!' />
              </div>
            ))}
          {(isLoadingBranch || isFetchingBranch) && (
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-16'>
              <LoadingMultiItem customClass='h-[400px] skeleton' />
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
        </div>
      </section>
    </main>
  );
}

export default StoresPage;
