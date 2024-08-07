import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FaXmark } from 'react-icons/fa6';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import { changePassword } from '@/api/user';
type Form = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
type Props = {
  closeForm: () => void;
};
const ChangePasswordPopup: React.FC<Props> = ({ closeForm }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const t = useTranslations('common');
  const { setVisiblePopup, closeAllPopup } = useContext(PopupContext);
  const [isShowCurPwd, setIsShowCurPwd] = useState(false);
  const [isShowNewPwd, setIsShowNewPwd] = useState(false);
  const [isShowReNewPwd, setIsShowReNewPwd] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      const res = await changePassword({ ...data });
      if (res.type === 'error') {
        setErrors(res.data);
        setSuccess(null);
      }
      if (res.type === 'success') {
        setSuccess('success');
        setErrors(null);
      }
    },
    [changePassword]
  );
  useEffect(() => {
    if (isSubmitting) {
      closeAllPopup();
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, setVisiblePopup, closeAllPopup]);
  useEffect(() => {
    if (success) {
      closeForm();
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('mess_change_password')}`,
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
  }, [success, errors, t, setVisiblePopup]);
  return (
    <section
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
    >
      <div className='max-w-[540px] w-full bg-white rounded-sm overflow-hidden px-4 py-6 flex flex-col gap-6 overflow-y-auto'>
        <div className='w-full flex justify-end'>
          <button
            aria-label='close-change-password'
            onClick={closeForm}
            disabled={isSubmitting}
          >
            <FaXmark className='text-2xl' />
          </button>
        </div>
        <form
          className='w-full flex flex-col gap-6'
          onSubmit={handleSubmit(onSubmit)}
          method='POST'
        >
          <h1 className='text-2xl font-bold'>{t('change_password')}</h1>
          <div className='w-full flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='current_password'>{t('current_password')}</label>
              <div className='relative w-full'>
                <input
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowCurPwd ? 'text' : 'password'}
                  placeholder={`${t('current_password')}`}
                  {...register('current_password')}
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowCurPwd(!isShowCurPwd)}
                  disabled={isSubmitting}
                >
                  {isShowCurPwd ? (
                    <FaRegEye className='text-xl' />
                  ) : (
                    <FaRegEyeSlash className='text-xl' />
                  )}
                </button>
              </div>
              {errors?.errors?.current_password && (
                <p className='text-red-500 font-bold text-sm md:text-base'>
                  {errors?.errors?.current_password[0]}
                </p>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='password'>{t('new_password')}</label>
              <div className='relative w-full'>
                <input
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowNewPwd ? 'text' : 'password'}
                  placeholder={`${t('new_password')}`}
                  {...register('password')}
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowNewPwd(!isShowNewPwd)}
                  disabled={isSubmitting}
                >
                  {isShowNewPwd ? (
                    <FaRegEye className='text-xl' />
                  ) : (
                    <FaRegEyeSlash className='text-xl' />
                  )}
                </button>
              </div>
              {errors?.errors?.password && (
                <p className='text-red-500 font-bold text-sm md:text-base'>
                  {errors?.errors?.password[0]}
                </p>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <label htmlFor='password_confirmation'>
                {t('re_new_password')}
              </label>
              <div className='relative w-full'>
                <input
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowReNewPwd ? 'text' : 'password'}
                  placeholder={`${t('re_new_password')}`}
                  {...register('password_confirmation')}
                  disabled={isSubmitting}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowReNewPwd(!isShowReNewPwd)}
                  disabled={isSubmitting}
                >
                  {isShowReNewPwd ? (
                    <FaRegEye className='text-xl' />
                  ) : (
                    <FaRegEyeSlash className='text-xl' />
                  )}
                </button>
              </div>
              {errors?.errors?.password_confirmation && (
                <p className='text-red-500 font-bold text-sm md:text-base'>
                  {errors?.errors?.password_confirmation[0]}
                </p>
              )}
            </div>
          </div>
          <button
            type='submit'
            className='font-bold bg-neutral-800 text-white py-3 md:py-4 rounded-sm'
            disabled={isSubmitting}
          >
            {t('change_password')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePasswordPopup;
