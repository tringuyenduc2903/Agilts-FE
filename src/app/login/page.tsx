'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { notFound, useRouter } from 'next/navigation';
import Loading from '../loading';
import { ModalContext } from '@/contexts/ModalProvider';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoginMutation } from '@/lib/redux/query/userQuery';
import getCSRFCookie from '@/api/CsrfCookie';
import bgLogo from '@/assets/h4-slider-img-1.jpg';
import Image from 'next/image';
import {
  FaFacebookF,
  FaGoogle,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '@/lib/redux/slice/userSlice';
type Form = {
  email: string;
  password: string;
  remember: boolean;
};
function LoginPage() {
  const router = useRouter();
  const { user, isLoadingUser, refetchUser } = useContext(FetchDataContext);
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const { setVisibleModal } = useContext(ModalContext);
  const { register, handleSubmit } = useForm<Form>();
  const [isShowPwd, setIsShowPwd] = useState(false);
  const [
    login,
    {
      data: loginData,
      isSuccess: isSuccessLogin,
      isError: isErrorLogin,
      error: errorLogin,
      isLoading: isLoadingLogin,
    },
  ] = useLoginMutation();
  const errors = useMemo(() => {
    if (isErrorLogin && errorLogin) {
      const error = errorLogin as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorLogin, errorLogin]);
  const onSubmit: SubmitHandler<Form> = async (data) => {
    await getCSRFCookie();
    await login({ ...data, remember: true });
  };
  useEffect(() => {
    if (isLoadingLogin) {
      setVisibleModal({ visibleLoadingModal: isLoadingLogin });
    }
    if (isErrorLogin || isSuccessLogin) {
      setVisibleModal({ visibleLoadingModal: false });
    }
  }, [isLoadingLogin, isErrorLogin, isSuccessLogin, setVisibleModal]);
  useEffect(() => {
    if (isSuccessLogin && loginData) {
      dispatch(setIsLoggedIn(true));
      if (loginData?.two_factor) {
        router.replace('/two-factor-qr-code');
      } else {
        router.replace('/');
      }
      refetchUser();
    }
    if (isErrorLogin && errorLogin) {
      const error = errorLogin as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessLogin,
    loginData,
    isErrorLogin,
    errorLogin,
    setVisibleModal,
    router,
    refetchUser,
    dispatch,
  ]);
  if (user) return router.replace('/');
  if (user && !isLoadingUser) {
    return notFound();
  }
  if (isLoadingUser) return <Loading />;
  return (
    <main className='relative w-full h-screen flex justify-center items-center font-medium text-sm sm:text-base'>
      <section
        className='absolute top-0 left-0 w-full h-full z-[5]'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      ></section>
      <section className='fixed w-full h-full top-0 left-0'>
        <Image
          fetchPriority='high'
          className='w-full h-full object-cover'
          src={bgLogo}
          alt='bg-logo'
        />
      </section>
      <section className='relative z-10 w-full h-full px-4 py-32 md:px-0 md:w-4/5 lg:w-2/3 2xl:w-1/2 rounded-sm grid lg:grid-cols-2 overflow-hidden'>
        <div className='hidden col-span-1 bg-neutral-800 text-white lg:flex flex-col justify-center items-center gap-8 px-16'>
          <h1 className='uppercase text-[56px] leading-[56px] font-bold tracking-[4px]'>
            The black & white form
          </h1>
          <div className='flex items-center gap-4'>
            <button
              className='bg-white rounded-full p-3 text-neutral-800 hover:text-red-500 transition-colors'
              disabled={isLoadingLogin}
            >
              <FaGoogle className='text-xl' />
            </button>
            <button
              className='bg-white rounded-full p-3 text-neutral-800 hover:text-blue-500 transition-colors'
              disabled={isLoadingLogin}
            >
              <FaFacebookF className='text-xl' />
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          method='POST'
          className='col-span-1 px-8 py-4 sm:p-8 bg-neutral-50 flex flex-col justify-center items-center gap-4'
        >
          <h1 className='font-bold text-2xl md:text-4xl uppercase tracking-[4px] md:tracking-[8px]'>
            {t('login')}
          </h1>
          <div className='w-full flex flex-col gap-2'>
            <input
              disabled={isLoadingLogin}
              className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
              type='email'
              placeholder='Email'
              formNoValidate
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
                disabled={isLoadingLogin}
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
                disabled={isLoadingLogin}
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
            <div className='flex items-center gap-2 relative'>
              <input
                id='remember'
                className='checked:bg-red-500'
                disabled={isLoadingLogin}
                type='checkbox'
                {...register('remember')}
              />
              <label className='font-bold text-sm' htmlFor='remember'>
                {t('remember_me')}
              </label>
            </div>
            {/* {errors.email && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.email?.message}
              </p>
            )} */}
          </div>
          <button
            className='w-full rounded-sm bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
            type='submit'
            disabled={isLoadingLogin}
          >
            {t('login')}
          </button>
          <div>
            <div className='my-2 flex justify-center items-center'>
              <button
                type='button'
                onClick={() => router.push('/forgot-password')}
              >
                {t('forgot-password')}?
              </button>
            </div>
            <div className='flex items-center gap-2'>
              <p>{t('mess-no-account')}</p>
              <button
                type='button'
                className='font-bold'
                onClick={() => router.push('/register')}
                disabled={isLoadingLogin}
              >
                {t('sign-up')}
              </button>
            </div>
            <div className='flex lg:hidden flex-col gap-2 items-center'>
              <p className='text-base font-bold'>{t('or')}</p>
              <div className='flex items-center gap-4'>
                <button
                  className='bg-neutral-800 rounded-full p-2 text-white hover:text-red-500 transition-colors'
                  disabled={isLoadingLogin}
                >
                  <FaGoogle className='text-lg' />
                </button>
                <button
                  className='bg-neutral-800 rounded-full p-2 text-white hover:text-blue-500 transition-colors'
                  disabled={isLoadingLogin}
                >
                  <FaFacebookF className='text-lg' />
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
