'use client';
import { UserContext } from '@/contexts/UserProvider';
import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import bgImg from '@/assets/port-title-area.jpg';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PopupContext } from '@/contexts/PopupProvider';
import { verifyTwoFactor } from '@/api/user';
import withNoAuth from '@/components/protected-page/withNoAuth';
type Form = {
  code: string;
  recovery_code: string;
};
function TwoFactorQrCodePage() {
  const t = useTranslations('common');
  const [curInput, setCurInput] = useState('code');
  const { refetchUser } = useContext(UserContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [errors, setErrors] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      const res = await verifyTwoFactor(
        curInput === 'code'
          ? { code: data.code }
          : { recovery_code: data.recovery_code }
      );
      if (res.type === 'error') {
        setErrors(res.data);
        setIsSuccess(false);
      }
      if (res.type === 'success') {
        await refetchUser();
        setIsSuccess(true);
        setErrors(null);
      }
    },
    [verifyTwoFactor, curInput]
  );
  useEffect(() => {
    if (isSubmitting) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, setVisiblePopup]);
  useEffect(() => {
    if (isSuccess) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('mess_success_verify'),
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
  }, [isSuccess, errors, setVisiblePopup, t]);
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
            {t('two_factor')}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                {t('using_code')}
              </button>
            )}
            {curInput === 'code' && (
              <button
                className='w-max text-sm font-bold text-blue-700'
                type='button'
                onClick={() => setCurInput('recovery')}
                disabled={isSubmitting}
              >
                {t('using_recovery')}
              </button>
            )}
            <button
              className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              type='submit'
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

export default withNoAuth(TwoFactorQrCodePage);
