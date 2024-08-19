'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import { resetPassword } from '@/api/user';
import withNoAuth from '@/components/protected-page/withNoAuth';

type Form = {
  email: string;
  password: string;
  password_confirmation: string;
};
function ResetPasswordPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const { setVisiblePopup } = useContext(PopupContext);
  const [isShowPwd, setIsShowPwd] = useState(false);
  const [isShowConfirmPwd, setIsShowConfirmPwd] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: {
      email: searchParams.get('email') || '',
      password: '',
      password_confirmation: '',
    },
  });
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      const res = await resetPassword({ ...data, token: token });
      if (res.type === 'error') {
        setIsSuccess(false);
        setErrors(res.data);
        setSuccess(null);
      }
      if (res.type === 'success') {
        setIsSuccess(true);
        setErrors(null);
        setSuccess(res.data);
      }
    },
    [token]
  );
  useEffect(() => {
    if (isSubmitting) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [setVisiblePopup, isSubmitting]);
  useEffect(() => {
    if (isSuccess && success) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: success?.message,
        },
      });
    }
    if (errors) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errors?.message,
        },
      });
    }
  }, [isSuccess, success, errors, setVisiblePopup]);
  return (
    <main className='w-full h-full pt-[72px] flex flex-col'>
      <section className='absolute h-full w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-full bg-neutral-800 lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 place-content-center gap-8'>
        <div className='col-span-1 flex flex-col justify-center items-center gap-4 lg:items-start'>
          <h1 className='text-red-600 font-bold tracking-[8px]'>
            {t('performance')}
          </h1>
          <p className='text-center md:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
            {t('reset-password')}
          </p>
        </div>
        <div className='col-span-1 px-4'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method='POST'
            className='flex flex-col gap-4'
          >
            <div className='w-full flex flex-col gap-2'>
              <input
                className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                type='email'
                placeholder='Email'
                {...register('email')}
                disabled
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
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='show-pwd-btn'
                  onClick={() => setIsShowPwd(!isShowPwd)}
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
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='show-pwd-btn'
                  onClick={() => setIsShowConfirmPwd(!isShowConfirmPwd)}
                  disabled={isSubmitting}
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

export default withNoAuth(ResetPasswordPage);
