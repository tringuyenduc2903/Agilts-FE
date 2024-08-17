'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { getCookies } from 'cookies-next';
import { PopupContext } from '@/contexts/PopupProvider';
import { Register, SingleImage } from '@/types/types';
import { registerAccount } from '@/api/user';
import { UserContext } from '@/contexts/UserProvider';
import withNoAuth from '@/components/protected-page/withNoAuth';
import { useGetSettingsQuery } from '@/lib/redux/query/adminQuery';
import { useResponsive } from '@/lib/hooks/useResponsive';
import CustomImage from '@/components/ui/CustomImage';
function RegisterPage() {
  const { locale } = useParams();
  const router = useRouter();
  const { refetchUser } = useContext(UserContext);
  const { data, isSuccess } = useGetSettingsQuery('auth');
  const authBannerSmall = useMemo(() => {
    return (
      (isSuccess && data?.find((b: any) => b?.key === 'auth_small_banner')) ||
      null
    );
  }, [isSuccess, data]);
  const authBannerLarge = useMemo(() => {
    return (
      (isSuccess && data?.find((b: any) => b?.key === 'auth_large_banner')) ||
      null
    );
  }, [isSuccess, data]);
  const index = useResponsive();
  const t = useTranslations('common');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Register>();
  const [isShowPwd, setIsShowPwd] = useState(false);
  const [isShowConfirmPwd, setIsShowConfirmPwd] = useState(false);
  const { setVisiblePopup } = useContext(PopupContext);
  const [errors, setErrors] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const onSubmit: SubmitHandler<Register> = useCallback(
    async (data) => {
      const res = await registerAccount(data);
      if (res.type === 'error') {
        setErrors(res.data);
        setSuccess(null);
      }
      if (res.type === 'success') {
        setErrors(null);
        setSuccess(res.data);
        await refetchUser();
      }
    },
    [registerAccount]
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
    if (isSubmitting) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
    if (!isSubmitting && errors) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errors?.message,
        },
      });
    }
  }, [isSubmitting, setVisiblePopup]);
  useEffect(() => {
    if (success) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('register_message')}`,
        },
      });
      router.replace(`/${locale}`);
      refetchUser();
    }
  }, [setVisiblePopup, t, router, refetchUser, locale]);
  return (
    <main className='w-full h-full flex justify-center items-center font-medium text-sm sm:text-base overflow-y-auto'>
      <section
        className='fixed top-0 left-0 w-full h-full z-[5]'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      ></section>
      <section className='fixed w-full h-full top-0 left-0'>
        {isSuccess && authBannerLarge && authBannerSmall && (
          <CustomImage
            fetchPriority='high'
            className='w-full h-full object-cover'
            image={
              index.isDesktop
                ? (authBannerLarge?.value?.image as SingleImage)
                : (authBannerSmall?.value?.image as SingleImage)
            }
            width={1800}
            height={1000}
          />
        )}
      </section>
      <section className='relative z-10 w-full min-h-screen px-4 py-32 md:px-0 md:w-4/5 lg:w-2/3 rounded-sm grid lg:grid-cols-2 overflow-hidden'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          method='POST'
          className='col-span-1 px-8 py-16 bg-neutral-50 flex flex-col justify-center items-center gap-4'
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
            {errors?.errors?.name && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors?.errors.name[0]}
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
            {errors?.errors?.email && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors?.errors.email[0]}
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
                disabled={isSubmitting}
              >
                {isShowPwd ? (
                  <FaRegEye className='text-xl' />
                ) : (
                  <FaRegEyeSlash className='text-xl' />
                )}
              </button>
            </div>
            {errors?.errors?.password && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors?.errors.password[0]}
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
            disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  onClick={() => redirectToOauth('google')}
                >
                  <FaGoogle className='text-lg' />
                </button>
                <button
                  type='button'
                  className='bg-neutral-800 rounded-full p-2 text-white hover:text-blue-500 transition-colors'
                  disabled={isSubmitting}
                  onClick={() => redirectToOauth('facebook')}
                >
                  <FaFacebookF className='text-lg' />
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className='hidden col-span-1 bg-neutral-800 text-white lg:flex flex-col justify-center items-center gap-8 px-24'>
          <h1 className='uppercase text-[56px] leading-[72px] font-bold tracking-[4px]'>
            {t('intro_form')}
          </h1>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              className='bg-white rounded-full p-3 text-neutral-800 hover:text-red-500 transition-colors'
              disabled={isSubmitting}
              onClick={() => redirectToOauth('google')}
            >
              <FaGoogle className='text-xl' />
            </button>
            <button
              type='button'
              className='bg-white rounded-full p-3 text-neutral-800 hover:text-blue-500 transition-colors'
              disabled={isSubmitting}
              onClick={() => redirectToOauth('facebook')}
            >
              <FaFacebookF className='text-xl' />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default withNoAuth(RegisterPage);
