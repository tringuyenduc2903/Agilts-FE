'use client';
import { UserContext } from '@/contexts/UserProvider';
import Image from 'next/image';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { PopupContext } from '@/contexts/PopupProvider';
import withNoAuth from '@/components/protected-page/withNoAuth';
import { useVerifyTwoFactorMutation } from '@/lib/redux/query/appQuery';
import CustomInputText from '@/components/ui/form/CustomInputText';
type Form = {
  code: string;
  recovery_code: string;
};
function TwoFactorQrCodePage() {
  const [curInput, setCurInput] = useState('code');
  const { refetchUser } = useContext(UserContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [verifyTwoFactor, { isSuccess, isLoading, isError, error }] =
    useVerifyTwoFactorMutation();
  const errors = useMemo(() => {
    return isError && (error as any)?.data;
  }, [isError, error]);
  const methods = useForm<Form>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await verifyTwoFactor(
        curInput === 'code'
          ? { code: data.code }
          : { recovery_code: data.recovery_code }
      );
    },
    [verifyTwoFactor, curInput]
  );
  useEffect(() => {
    if (isSubmitting || isLoading) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, isLoading, setVisiblePopup]);
  useEffect(() => {
    if (isSuccess) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Xác thực tài khoản thành công!',
        },
      });
      refetchUser();
    }
    if (isError && error) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (error as any)?.data?.message,
        },
      });
    }
  }, [isSuccess, isError, error, setVisiblePopup, refetchUser]);
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
            2FA
          </p>
        </div>
        <div className='col-span-1 px-4'>
          <FormProvider {...methods}>
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
                    Nhập mã
                  </label>
                  <CustomInputText
                    form_name='code'
                    type='text'
                    placeholder='Nhập mã gồm 6 chữ số do ứng dụng xác thực tạo'
                    error={errors?.code?.[0]}
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              )}
              {curInput === 'recovery' && (
                <div className='flex flex-col gap-2'>
                  <label
                    className='lg:text-neutral-800 text-white text-center lg:text-start'
                    htmlFor='recovery_code'
                  >
                    Nhập mã khôi phục
                  </label>
                  <CustomInputText
                    form_name='recovery_code'
                    type='text'
                    placeholder='Nhập mã khôi phục'
                    error={errors?.recovery_code?.[0]}
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              )}
              {curInput === 'recovery' && (
                <button
                  className='w-max text-sm font-bold text-blue-700'
                  type='button'
                  onClick={() => setCurInput('code')}
                  disabled={isSubmitting || isLoading}
                >
                  Sử dụng mã xác thực ứng dụng
                </button>
              )}
              {curInput === 'code' && (
                <button
                  className='w-max text-sm font-bold text-blue-700'
                  type='button'
                  onClick={() => setCurInput('recovery')}
                  disabled={isSubmitting || isLoading}
                >
                  Sử dụng mã khôi phục
                </button>
              )}
              <button
                className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
                type='submit'
                disabled={isSubmitting || isLoading}
              >
                Xác nhận
              </button>
            </form>
          </FormProvider>
        </div>
      </section>
    </main>
  );
}

export default withNoAuth(TwoFactorQrCodePage);
