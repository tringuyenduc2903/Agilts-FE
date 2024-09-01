'use client';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { FaFacebookF, FaGoogle } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import { Register, SingleImage } from '@/types/types';
import { UserContext } from '@/contexts/UserProvider';
import withNoAuth from '@/components/protected-page/withNoAuth';
import { useResponsive } from '@/lib/hooks/useResponsive';
import CustomImage from '@/components/ui/CustomImage';
import {
  useGetSettingsQuery,
  useRegisterMutation,
} from '@/lib/redux/query/appQuery';
import CustomInputPassword from '@/components/ui/form/CustomInputPassword';
import { referrerURL } from '@/config/config';
import CustomInputText from '@/components/ui/form/CustomInputText';
function RegisterPage() {
  const router = useRouter();
  const { getCsrfCookie, isLoadingCSRF } = useContext(UserContext);
  const { data: settingsData, isSuccess: isSuccessSettings } =
    useGetSettingsQuery('auth');
  const authBannerSmall = useMemo(() => {
    return (
      (isSuccessSettings &&
        settingsData?.find((b: any) => b?.key === 'auth_small_banner')) ||
      null
    );
  }, [isSuccessSettings, settingsData]);
  const authBannerLarge = useMemo(() => {
    return (
      (isSuccessSettings &&
        settingsData?.find((b: any) => b?.key === 'auth_large_banner')) ||
      null
    );
  }, [isSuccessSettings, settingsData]);
  const index = useResponsive();
  const [
    registerAccount,
    {
      isSuccess: isSuccessRegister,
      isLoading: isLoadingRegister,
      isError: isErrorRegister,
      error: errorRegister,
    },
  ] = useRegisterMutation();
  const errors = useMemo(() => {
    return isErrorRegister && (errorRegister as any)?.data;
  }, [isErrorRegister, errorRegister]);
  const methods = useForm<Register>();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { setVisiblePopup } = useContext(PopupContext);
  const onSubmit: SubmitHandler<Register> = useCallback(
    async (data) => {
      await getCsrfCookie();
      await registerAccount(data);
    },
    [getCsrfCookie, registerAccount]
  );
  const redirectToOauth = useCallback((provider: 'google' | 'facebook') => {
    if (typeof window !== 'undefined') {
      window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/redirect/${provider}${
          referrerURL.includes(process.env.NEXT_PUBLIC_CLIENT_URL as string)
            ? `?cb=${referrerURL}`
            : ''
        }`,
        '_self'
      );
    }
  }, []);
  useEffect(() => {
    if (isSubmitting || isLoadingRegister) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
    if (!isSubmitting && errorRegister) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorRegister as any)?.data?.message,
        },
      });
    }
  }, [isSubmitting, isLoadingRegister, errorRegister, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessRegister) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Đăng ký tài khoản thành công!',
        },
      });
    }
    if (isErrorRegister && errorRegister) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorRegister as any)?.data?.message,
        },
      });
    }
  }, [
    isSuccessRegister,
    isErrorRegister,
    errorRegister,
    setVisiblePopup,
    router,
  ]);
  return (
    <main className='w-full h-full flex justify-center items-center font-medium text-sm sm:text-base overflow-y-auto'>
      <section
        className='fixed top-0 left-0 w-full h-full z-[5]'
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      ></section>
      <section className='fixed w-full h-full top-0 left-0'>
        {isSuccessSettings && authBannerLarge && authBannerSmall && (
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
      <section className='relative z-10 w-full min-h-screen px-4 py-32 md:px-0 md:w-4/5 lg:w-2/3 rounded-sm grid 2xl:grid-cols-2 overflow-hidden'>
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method='POST'
            className='col-span-1 px-8 py-16 bg-neutral-50 flex flex-col justify-center items-center gap-4'
          >
            <h1 className='font-bold text-2xl md:text-4xl uppercase tracking-[4px] md:tracking-[8px]'>
              Đăng ký
            </h1>
            <CustomInputText
              form_name='name'
              type='text'
              placeholder='Nhập tên người dùng...'
              error={errors?.errors?.name?.[0]}
              disabled={isSubmitting || isLoadingCSRF}
            />
            <CustomInputText
              form_name='email'
              type='email'
              placeholder='Địa chỉ email'
              error={errors?.errors?.email?.[0]}
              disabled={isSubmitting || isLoadingCSRF}
            />
            <CustomInputPassword
              placeholder='Nhập mật khẩu...'
              disabled={isSubmitting || isLoadingCSRF || isLoadingRegister}
              error={errors?.errors?.password?.[0]}
            />
            <CustomInputPassword
              form_name='password_confirmation'
              placeholder='Nhập lại mật khẩu...'
              {...register('password_confirmation')}
              disabled={isSubmitting || isLoadingCSRF || isLoadingRegister}
            />
            <button
              className='w-full rounded-sm bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              type='submit'
              disabled={isSubmitting || isLoadingCSRF || isLoadingRegister}
            >
              Đăng ký
            </button>
            <div>
              <div className='flex items-center gap-2'>
                <p>Đã có tài khoản?</p>
                <button
                  type='button'
                  className='font-bold'
                  onClick={() => router.push(`/login`)}
                  disabled={isSubmitting || isLoadingCSRF || isLoadingRegister}
                >
                  Đăng nhập
                </button>
              </div>
              <div className='flex 2xl:hidden flex-col gap-2 items-center'>
                <p className='text-base font-bold'>Hoặc</p>
                <div className='flex items-center gap-4'>
                  <button
                    type='button'
                    className='bg-neutral-800 rounded-full p-2 text-white hover:text-red-500 transition-colors'
                    disabled={
                      isSubmitting || isLoadingCSRF || isLoadingRegister
                    }
                    onClick={() => redirectToOauth('google')}
                  >
                    <FaGoogle className='text-lg' />
                  </button>
                  <button
                    type='button'
                    className='bg-neutral-800 rounded-full p-2 text-white hover:text-blue-500 transition-colors'
                    disabled={
                      isSubmitting || isLoadingCSRF || isLoadingRegister
                    }
                    onClick={() => redirectToOauth('facebook')}
                  >
                    <FaFacebookF className='text-lg' />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
        <div className='hidden col-span-1 bg-neutral-800 text-white 2xl:flex flex-col justify-center items-center gap-8 px-24'>
          <h1 className='uppercase text-[56px] leading-[72px] font-bold tracking-[4px]'>
            Tự do & Chinh phục
          </h1>
          <div className='flex items-center gap-4'>
            <button
              type='button'
              className='bg-white rounded-full p-3 text-neutral-800 hover:text-red-500 transition-colors'
              disabled={isSubmitting || isLoadingCSRF || isLoadingRegister}
              onClick={() => redirectToOauth('google')}
            >
              <FaGoogle className='text-xl' />
            </button>
            <button
              type='button'
              className='bg-white rounded-full p-3 text-neutral-800 hover:text-blue-500 transition-colors'
              disabled={isSubmitting || isLoadingCSRF || isLoadingRegister}
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
