'use client';
import React, { useCallback, useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { PopupContext } from '@/contexts/PopupProvider';
import withNoAuth from '@/components/protected-page/withNoAuth';
import { useForgotPasswordMutation } from '@/lib/redux/query/appQuery';
import CustomInputText from '@/components/ui/form/CustomInputText';

type Form = {
  email: string;
};
function ForgotPasswordPage() {
  const { setVisiblePopup } = useContext(PopupContext);
  const [forgotPassword, { data, isSuccess, isLoading, isError, error }] =
    useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await forgotPassword(data.email);
    },
    [forgotPassword]
  );
  useEffect(() => {
    if (isSubmitting || isLoading) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, isLoading, setVisiblePopup]);
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
          <p className='text-center md:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
            Quên mật khẩu
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
              Tìm tài khoản của bạn
            </label>
            <CustomInputText
              form_name='email'
              type='email'
              placeholder='Nhập địa chỉ email...'
              disabled={isSubmitting}
              reacthooksform={false}
            />
            <button
              className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              disabled={isSubmitting}
            >
              Xác nhận
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default withNoAuth(ForgotPasswordPage);
