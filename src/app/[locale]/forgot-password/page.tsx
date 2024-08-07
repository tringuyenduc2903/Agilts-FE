'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PopupContext } from '@/contexts/PopupProvider';
import { forgotPassword } from '@/api/user';
import withNoAuth from '@/protected-page/withNoAuth';

type Form = {
  email: string;
};
function ForgotPasswordPage() {
  const t = useTranslations('common');
  const { setVisiblePopup } = useContext(PopupContext);
  const [errors, setErrors] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      const res = await forgotPassword(data.email);
      if (res.type === 'error') {
        setErrors(res.data);
        setSuccess(null);
      }
      if (res.type === 'success') {
        setSuccess(res.data);
        setErrors(null);
      }
    },
    [forgotPassword]
  );
  useEffect(() => {
    if (isSubmitting) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
    if (!isSubmitting && success) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: success?.message,
        },
      });
    }
    if (!isSubmitting && errors) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errors?.message,
        },
      });
    }
  }, [isSubmitting, success, errors, setVisiblePopup]);
  return (
    <main className='w-full pt-[72px] flex flex-col'>
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
            {t('forgot-password')}
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
              htmlFor='email'
            >
              {t('find-your-account')}
            </label>
            <div className='relative w-full'>
              <input
                className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                type='email'
                formNoValidate
                placeholder={`${t('enter_email')}`}
                {...register('email')}
                disabled={isSubmitting}
              />
            </div>
            <button
              className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              disabled={isSubmitting}
            >
              {t('submit')}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default withNoAuth(ForgotPasswordPage);
