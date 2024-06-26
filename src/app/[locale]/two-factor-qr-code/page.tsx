'use client';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { useVerifyTwoFactorMutation } from '@/lib/redux/query/userQuery';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import bgImg from '@/assets/port-title-area.jpg';
import { SubmitHandler, useForm } from 'react-hook-form';
import Loading from '../loading';
import { useSelector } from 'react-redux';
import { isLoggedInState } from '@/lib/redux/slice/userSlice';
import { ModalContext } from '@/contexts/ModalProvider';
type Form = {
  code: string;
  recovery_code: string;
};
function TwoFactorQrCodePage() {
  const t = useTranslations('common');
  const isLoggedIn = useSelector(isLoggedInState);
  const [curInput, setCurInput] = useState('code');
  const router = useRouter();
  const {
    user,
    isSuccessUser,
    isLoadingUser,
    refetchUser,
    handleGetCSRFCookie,
    isLoadingCSRF,
  } = useContext(FetchDataContext);
  const { setVisibleModal } = useContext(ModalContext);
  const [
    verifyTwoFactor,
    {
      isSuccess: isSuccessVerify,
      isLoading: isLoadingVerify,
      isError: isErrorVerify,
      error: errorVerify,
    },
  ] = useVerifyTwoFactorMutation();
  const errors = useMemo(() => {
    if (isErrorVerify && errorVerify) {
      const error = errorVerify as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorVerify, errorVerify]);
  const { register, handleSubmit } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await handleGetCSRFCookie();
      await verifyTwoFactor(
        curInput === 'code'
          ? { code: data.code }
          : { recovery_code: data.recovery_code }
      );
    },
    [handleGetCSRFCookie, verifyTwoFactor, curInput]
  );
  useEffect(() => {
    if (isSuccessVerify) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: 'Xác thực tài khoản thành công!',
        },
      });
      refetchUser();
    }
  }, [isSuccessVerify, refetchUser, setVisibleModal]);
  if (user && isSuccessUser && !isLoadingUser) {
    return router.replace('/');
  }
  if (isLoadingUser) return <Loading />;
  if (!isLoggedIn) return notFound();
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
          <p className='text-2xl sm:text-4xl md:text-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
            {t('two-factor')}
          </p>
        </div>
        <div className='col-span-1 px-4'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method='POST'
            className='flex flex-col gap-4'
          >
            {curInput === 'code' && (
              <div className='flex flex-col gap-2'>
                <label
                  className='lg:text-neutral-800 text-white text-center lg:text-start'
                  htmlFor='code'
                >
                  {t('enter_key')}
                </label>
                <div className='relative w-full'>
                  <input
                    className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                    type='text'
                    placeholder={`${t('mess_enter_code')}`}
                    {...register('code')}
                    disabled={isLoadingVerify || isLoadingCSRF}
                  />
                  {errors?.code && (
                    <p className='text-red-500 font-bold text-sm md:text-base'>
                      {errors.code[0]}
                    </p>
                  )}
                </div>
              </div>
            )}
            {curInput === 'recovery' && (
              <div className='flex flex-col gap-2'>
                <label
                  className='lg:text-neutral-800 text-white text-center lg:text-start'
                  htmlFor='recovery_code'
                >
                  {t('enter_recovery_code')}
                </label>
                <div className='relative w-full'>
                  <input
                    className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                    type='text'
                    placeholder={`${t('recovery_code')}`}
                    {...register('recovery_code')}
                    disabled={isLoadingVerify || isLoadingCSRF}
                  />
                  {errors?.recovery_code && (
                    <p className='text-red-500 font-bold text-sm md:text-base'>
                      {errors.recovery_code[0]}
                    </p>
                  )}
                </div>
              </div>
            )}
            {curInput === 'recovery' && (
              <button
                className='w-max text-sm font-bold text-blue-700'
                type='button'
                onClick={() => setCurInput('code')}
              >
                {t('using_code')}
              </button>
            )}
            {curInput === 'code' && (
              <button
                className='w-max text-sm font-bold text-blue-700'
                type='button'
                onClick={() => setCurInput('recovery')}
              >
                {t('using_recovery')}
              </button>
            )}
            <button
              className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              type='submit'
              disabled={isLoadingVerify || isLoadingCSRF}
            >
              {isLoadingVerify || isLoadingCSRF
                ? `...${t('loading')}`
                : t('submit')}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default TwoFactorQrCodePage;
