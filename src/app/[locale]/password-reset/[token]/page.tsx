'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import bgImg from '@/assets/port-title-area.jpg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useResetPasswordMutation } from '@/lib/redux/query/userQuery';
import { ModalContext } from '@/contexts/ModalProvider';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { notFound, useParams, useSearchParams } from 'next/navigation';
import Loading from '../../loading';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

type Form = {
  email: string;
  password: string;
  password_confirmation: string;
};
function ResetPasswordPage() {
  const { token } = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const {
    user,
    isLoadingUser,
    isSuccessUser,
    handleGetCSRFCookie,
    isLoadingCSRF,
  } = useContext(FetchDataContext);
  const { setVisibleModal } = useContext(ModalContext);
  const [isShowPwd, setIsShowPwd] = useState(false);
  const [isShowConfirmPwd, setIsShowConfirmPwd] = useState(false);
  const { register, handleSubmit, formState } = useForm<Form>({
    defaultValues: {
      email: searchParams.get('email') || '',
      password: '',
      password_confirmation: '',
    },
  });
  const [
    resetPassword,
    {
      data: postData,
      isSuccess: isSuccessPost,
      isLoading: isLoadingPost,
      isError: isErrorPost,
      error: errorPost,
    },
  ] = useResetPasswordMutation();
  const errors = useMemo(() => {
    if (isErrorPost && errorPost) {
      const error = errorPost as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorPost, errorPost]);
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await handleGetCSRFCookie();
      await resetPassword({ ...data, token: token });
    },
    [handleGetCSRFCookie, resetPassword]
  );
  useEffect(() => {
    if (isSuccessPost && postData) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: postData?.message,
        },
      });
      formState.defaultValues = {
        email: '',
        password: '',
        password_confirmation: '',
      };
    }
    if (isErrorPost && errorPost) {
      const error = errorPost as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessPost,
    postData,
    isErrorPost,
    errorPost,
    setVisibleModal,
    formState,
  ]);
  if (isLoadingUser) return <Loading />;
  if (user && isSuccessUser && !isLoadingUser) return notFound();
  return (
    <main className='w-full pt-[72px] flex flex-col'>
      <section className='absolute h-[500px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[500px] bg-neutral-800 lg:bg-transparent grid grid-cols-1 lg:grid-cols-2 place-content-center gap-8'>
        <div className='col-span-1 flex flex-col justify-center items-center gap-4 lg:items-start'>
          <h1 className='text-red-600 font-bold tracking-[8px]'>
            {t('performance')}
          </h1>
          <p className='text-center md:text-start text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
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
                  aria-label='show-pwd-btn'
                  onClick={() => setIsShowPwd(false)}
                  disabled={isLoadingPost || isLoadingCSRF}
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
                  aria-label='show-pwd-btn'
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
              className='w-full rounded-sm bg-red-500 lg:bg-neutral-800 text-white py-3 md:py-4 font-bold tracking-[4px] text-base md:text-lg'
              type='submit'
              disabled={isLoadingPost || isLoadingCSRF}
            >
              {isLoadingPost || isLoadingCSRF
                ? `...${t('loading')}`
                : t('submit')}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ResetPasswordPage;
