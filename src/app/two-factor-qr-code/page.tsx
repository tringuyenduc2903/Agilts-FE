'use client';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import {
  useConfirmPasswordMutation,
  useConfirmPasswordStatusQuery,
  useTwoFactorQrCodeQuery,
} from '@/lib/redux/query/userQuery';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import bgImg from '@/assets/port-title-area.jpg';
import { SubmitHandler, useForm } from 'react-hook-form';
import getCSRFCookie from '@/api/CsrfCookie';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import Loading from '../loading';
type Form = {
  password: string;
};
function TwoFactorQrCodePage() {
  const { t } = useTranslation('common');
  const { user, isSuccessUser, isLoadingUser } = useContext(FetchDataContext);
  const [isShowPwd, setIsShowPwd] = useState(false);
  const { register, handleSubmit } = useForm<Form>();
  const [
    confirmPassword,
    {
      isSuccess: isSuccessConfirm,
      isLoading: isLoadingConfirm,
      isError: isErrorConfirm,
      error: errorConfirm,
    },
  ] = useConfirmPasswordMutation();
  const {
    data: statusConfirm,
    isLoading: isLoadingStatus,
    isSuccess: isSuccessStatus,
    isError: isErrorStatus,
    error: errorStatus,
  } = useConfirmPasswordStatusQuery(null, { skip: !isSuccessConfirm });
  const {
    data: codeData,
    isSuccess: isSuccessCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useTwoFactorQrCodeQuery(null, { skip: !isSuccessStatus });
  if (!user && !isSuccessUser && !isLoadingUser) {
    return notFound();
  }
  const onSubmit: SubmitHandler<Form> = async (data) => {
    await getCSRFCookie();
    await confirmPassword(data.password);
  };
  if (isLoadingUser || isLoadingCode) return <Loading />;
  // console.log(codeData, isSuccessCode, isErrorCode);
  // console.log(statusConfirm, isSuccessStatus, isErrorStatus, errorStatus);
  return (
    <main className='w-full pt-[72px] flex flex-col'>
      <section className='absolute h-[500px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[500px] bg-neutral-800 lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 place-content-center gap-8'>
        <div className='col-span-1 flex flex-col justify-center items-center gap-4 lg:items-start'>
          <h1 className='text-red-600 font-bold tracking-[8px]'>
            {t('performance')}
          </h1>
          <p className='text-4xl md:text-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
            {t('two-factor')}
          </p>
        </div>
        <div className='col-span-1 px-4'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method='POST'
            className='flex flex-col gap-4'
          >
            <label
              className='lg:text-neutral-800 text-white text-center lg:text-start'
              htmlFor='password'
            >
              {t('confirm-pwd')}
            </label>
            <div className='relative w-full'>
              <input
                className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                type={isShowPwd ? 'text' : 'password'}
                placeholder={`${t('password')}`}
                {...register('password')}
              />
              {isShowPwd && (
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='show-pwd-btn'
                  onClick={() => setIsShowPwd(false)}
                >
                  <FaRegEye className='text-xl' />
                </button>
              )}
              {!isShowPwd && (
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='hide-pwd-btn'
                  onClick={() => setIsShowPwd(true)}
                >
                  <FaRegEyeSlash className='text-xl' />
                </button>
              )}
            </div>
            <button
              className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              type='submit'
            >
              {t('submit')}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default TwoFactorQrCodePage;
