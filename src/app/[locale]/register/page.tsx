'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { notFound, useParams, useRouter } from 'next/navigation';
import Loading from '../loading';
import bgLogo from '@/assets/h4-slider-img-1.jpg';
import Image from 'next/image';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  FaFacebookF,
  FaGoogle,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';
import { useTranslations } from 'next-intl';
import { useRegisterMutation } from '@/lib/redux/query/userQuery';
import { getCookies } from 'cookies-next';
import { PopupContext } from '@/contexts/PopupProvider';
type Form = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
function RegisterPage() {
  const { locale } = useParams();
  const router = useRouter();
  const {
    user,
    isLoadingUser,
    refetchUser,
    handleGetCSRFCookie,
    isLoadingCSRF,
  } = useContext(FetchDataContext);
  const t = useTranslations('common');
  const { register, handleSubmit } = useForm<Form>();
  const [isShowPwd, setIsShowPwd] = useState(false);
  const [isShowConfirmPwd, setIsShowConfirmPwd] = useState(false);
  const { setVisiblePopup } = useContext(PopupContext);
  const [
    registerUser,
    {
      isSuccess: isSuccessRegister,
      isLoading: isLoadingRegister,
      isError: isErrorRegister,
      error: errorRegister,
    },
  ] = useRegisterMutation();
  const errors = useMemo(() => {
    if (isErrorRegister && errorRegister) {
      const error = errorRegister as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorRegister, errorRegister]);
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await handleGetCSRFCookie();
      await registerUser(data);
    },
    [handleGetCSRFCookie, registerUser]
  );
  const redirectToOauth = useCallback((provider: 'google' | 'facebook') => {
    if (typeof window !== 'undefined') {
      window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/redirect/${provider}`,
        '_self'
      );
    }
  }, []);
  useEffect(() => {
    if (isLoadingCSRF || isLoadingRegister) {
      setVisiblePopup({ visibleLoadingPopup: true });
    }
    if (
      (isErrorRegister || isSuccessRegister) &&
      !isLoadingCSRF &&
      !isLoadingRegister
    ) {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [
    isLoadingCSRF,
    isLoadingRegister,
    isErrorRegister,
    isSuccessRegister,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isSuccessRegister) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('register_message')}`,
        },
      });
      router.replace(`/${locale}`);
      refetchUser();
    }
    if (isErrorRegister && errorRegister) {
      const err = errorRegister as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: err?.data?.message,
        },
      });
    }
  }, [
    isSuccessRegister,
    isErrorRegister,
    errorRegister,
    setVisiblePopup,
    t,
    router,
    refetchUser,
    locale,
  ]);
  if (user) return router.replace(`/${locale}`);
  if (user && !isLoadingUser) {
    return notFound();
  }
  if (isLoadingUser) return <Loading />;
  return (
    <main className='relative w-full h-screen flex justify-center items-center font-medium text-sm sm:text-base overflow-y-auto'>
      <section
        className='absolute top-0 left-0 w-full h-full z-[5]'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      ></section>
      <section className='absolute w-full h-full top-0 left-0'>
        <Image
          fetchPriority='high'
          className='w-full h-full object-cover'
          src={bgLogo}
          alt='bg-logo'
        />
      </section>
      <section className='relative z-10 w-full h-full px-4 py-32 md:px-0 md:w-4/5 lg:w-2/3 2xl:w-1/2 rounded-sm grid lg:grid-cols-2 overflow-hidden'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          method='POST'
          className='col-span-1 px-8 py-4 sm:p-8 bg-neutral-50 flex flex-col justify-center items-center gap-4'
        >
          <h1 className='font-bold text-2xl md:text-4xl uppercase tracking-[4px] md:tracking-[8px]'>
            {t('register')}
          </h1>
          <div className='w-full flex flex-col gap-2'>
            <input
              className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
              type='name'
              placeholder={`${t('name')}`}
              {...register('name')}
            />
            {errors?.name && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.name[0]}
              </p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <input
              className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
              type='email'
              placeholder='Email'
              {...register('email')}
            />
            {errors?.email && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.email[0]}
              </p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='relative w-full'>
              <input
                className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                type={isShowPwd ? 'text' : 'password'}
                placeholder={`${t('password')}`}
                {...register('password')}
              />
              <button
                type='button'
                className='absolute top-1/2 -translate-y-1/2 right-2'
                aria-label='toggle-pwd-btn'
                onClick={() => setIsShowPwd(!isShowPwd)}
                disabled={isLoadingRegister || isLoadingCSRF}
              >
                {isShowPwd ? (
                  <FaRegEye className='text-xl' />
                ) : (
                  <FaRegEyeSlash className='text-xl' />
                )}
              </button>
            </div>
            {errors?.password && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.password[0]}
              </p>
            )}
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='relative w-full'>
              <input
                className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                type={isShowConfirmPwd ? 'text' : 'password'}
                placeholder={`${t('confirm-pwd')}`}
                {...register('password_confirmation')}
              />
              <button
                type='button'
                className='absolute top-1/2 -translate-y-1/2 right-2'
                aria-label='toggle-pwd-btn'
                onClick={() => setIsShowConfirmPwd(!isShowConfirmPwd)}
              >
                {isShowConfirmPwd ? (
                  <FaRegEye className='text-xl' />
                ) : (
                  <FaRegEyeSlash className='text-xl' />
                )}
              </button>
            </div>
          </div>
          <button
            className='w-full rounded-sm bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
            type='submit'
            disabled={isLoadingRegister}
          >
            {t('register')}
          </button>
          <div>
            <div className='flex items-center gap-2'>
              <p>{t('mess-have-account')}</p>
              <button
                type='button'
                className='font-bold'
                onClick={() =>
                  router.push(`/${getCookies()?.NEXT_LOCALE || 'vi'}/login`)
                }
                disabled={isLoadingRegister || isLoadingCSRF}
              >
                {t('sign-in')}
              </button>
            </div>
            <div className='flex lg:hidden flex-col gap-2 items-center'>
              <p className='text-base font-bold'>{t('or')}</p>
              <div className='flex items-center gap-4'>
                <button
                  type='button'
                  className='bg-neutral-800 rounded-full p-2 text-white hover:text-red-500 transition-colors'
                  disabled={isLoadingRegister || isLoadingCSRF}
                  onClick={() => redirectToOauth('google')}
                >
                  <FaGoogle className='text-lg' />
                </button>
                <button
                  type='button'
                  className='bg-neutral-800 rounded-full p-2 text-white hover:text-blue-500 transition-colors'
                  disabled={isLoadingRegister || isLoadingCSRF}
                  onClick={() => redirectToOauth('facebook')}
                >
                  <FaFacebookF className='text-lg' />
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className='hidden col-span-1 bg-neutral-800 text-white lg:flex flex-col justify-center items-center gap-8 px-16'>
          <h1 className='uppercase text-[56px] leading-[56px] font-bold tracking-[4px]'>
            The black & white form
          </h1>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;
