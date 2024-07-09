import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { useChangePasswordMutation } from '@/lib/redux/query/userQuery';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FaXmark } from 'react-icons/fa6';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
type Form = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
type Props = {
  closeForm: () => void;
};
const ChangePasswordPopup: React.FC<Props> = ({ closeForm }) => {
  const { register, handleSubmit } = useForm<Form>();
  const { handleGetCSRFCookie, isLoadingCSRF } = useContext(FetchDataContext);
  const t = useTranslations('common');
  const { setVisiblePopup, closeAllPopup } = useContext(PopupContext);
  const [isShowCurPwd, setIsShowCurPwd] = useState(false);
  const [isShowNewPwd, setIsShowNewPwd] = useState(false);
  const [isShowReNewPwd, setIsShowReNewPwd] = useState(false);
  const [
    changePassword,
    {
      isSuccess: isSuccessChangePassword,
      isLoading: isLoadingChangePassword,
      isError: isErrorChangePassword,
      error: errorChangePassword,
    },
  ] = useChangePasswordMutation();
  const errors = useMemo(() => {
    if (isErrorChangePassword && errorChangePassword) {
      const error = errorChangePassword as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorChangePassword, errorChangePassword]);
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await handleGetCSRFCookie();
      await changePassword(data);
    },
    [handleGetCSRFCookie, changePassword]
  );
  useEffect(() => {
    if (isLoadingCSRF || isLoadingChangePassword) {
      closeAllPopup();
      setVisiblePopup({ visibleLoadingPopup: true });
    }
  }, [isLoadingCSRF, isLoadingChangePassword, setVisiblePopup, closeAllPopup]);
  useEffect(() => {
    if (isSuccessChangePassword) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('mess_change_password')}`,
        },
      });
      closeForm();
    }
    if (isErrorChangePassword && errorChangePassword) {
      const error = errorChangePassword as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessChangePassword,
    isErrorChangePassword,
    errorChangePassword,
    setVisiblePopup,
    closeForm,
    t,
  ]);
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
            disabled={isLoadingCSRF || isLoadingChangePassword}
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
                  disabled={isLoadingCSRF || isLoadingChangePassword}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowCurPwd(!isShowCurPwd)}
                  disabled={isLoadingCSRF || isLoadingChangePassword}
                >
                  {isShowCurPwd ? (
                    <FaRegEye className='text-xl' />
                  ) : (
                    <FaRegEyeSlash className='text-xl' />
                  )}
                </button>
              </div>
              {errors?.current_password && (
                <p className='text-red-500 font-bold text-sm md:text-base'>
                  {errors.current_password[0]}
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
                  disabled={isLoadingCSRF || isLoadingChangePassword}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowNewPwd(!isShowNewPwd)}
                  disabled={isLoadingCSRF || isLoadingChangePassword}
                >
                  {isShowNewPwd ? (
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
                  disabled={isLoadingCSRF || isLoadingChangePassword}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowReNewPwd(!isShowReNewPwd)}
                  disabled={isLoadingCSRF || isLoadingChangePassword}
                >
                  {isShowReNewPwd ? (
                    <FaRegEye className='text-xl' />
                  ) : (
                    <FaRegEyeSlash className='text-xl' />
                  )}
                </button>
              </div>
              {errors?.password_confirmation && (
                <p className='text-red-500 font-bold text-sm md:text-base'>
                  {errors.password_confirmation[0]}
                </p>
              )}
            </div>
            {/* <button
              type='button'
              className='w-max text-start font-bold'
              disabled={isLoadingChangePassword}
            >
              {t('forgot-password')}?
            </button> */}
          </div>
          <button
            type='submit'
            className='font-bold bg-neutral-800 text-white py-3 md:py-4 rounded-sm'
            disabled={isLoadingCSRF || isLoadingChangePassword}
          >
            {t('change_password')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePasswordPopup;
