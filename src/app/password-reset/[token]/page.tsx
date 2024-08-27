'use client';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { PopupContext } from '@/contexts/PopupProvider';
import withNoAuth from '@/components/protected-page/withNoAuth';
import CustomInputPassword from '@/components/ui/CustomInputPassword';
import { useResetPasswordMutation } from '@/lib/redux/query/appQuery';

type Form = {
  email: string;
  password: string;
  password_confirmation: string;
};
function ResetPasswordPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const { setVisiblePopup } = useContext(PopupContext);
  const [resetPassword, { data, isSuccess, isLoading, isError, error }] =
    useResetPasswordMutation();
  const errors = useMemo(() => {
    return isError && (error as any)?.data;
  }, [isError, error]);
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
      await resetPassword({ ...data, token: token });
    },
    [resetPassword, token]
  );
  useEffect(() => {
    if (isSubmitting || isLoading) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [setVisiblePopup, isSubmitting, isLoading]);
  useEffect(() => {
    if (isSuccess && data) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: data?.message,
        },
      });
    }
    if (isError && error) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (error as any)?.data?.message,
        },
      });
    }
  }, [isSuccess, data, isError, error, setVisiblePopup]);
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
          <p className='text-center md:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
            Đặt lại mật khẩu
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
              <CustomInputPassword
                placeholder='Nhập mật khẩu...'
                {...register('password')}
                disabled={isSubmitting || isLoading}
              />
              {errors?.password && (
                <p className='text-red-500 font-bold text-sm md:text-base'>
                  {errors.password[0]}
                </p>
              )}
            </div>
            <div className='w-full flex flex-col gap-2'>
              <CustomInputPassword
                placeholder='Nhập lại mật khẩu...'
                {...register('password_confirmation')}
                disabled={isSubmitting || isLoading}
              />
            </div>
            <button
              className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              type='submit'
            >
              Xác nhận
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default withNoAuth(ResetPasswordPage);
