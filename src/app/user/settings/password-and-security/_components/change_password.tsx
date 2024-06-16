import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { useChangePasswordMutation } from '@/lib/redux/query/userQuery';
import React, {
  LegacyRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
type Form = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
type Props = {
  closePopup: () => void;
};
const ChangePasswordPopup: React.FC<Props> = ({ closePopup }) => {
  const { register, handleSubmit } = useForm<Form>();
  const { handleGetCSRFCookie, isLoadingCSRF } = useContext(FetchDataContext);
  const { t } = useTranslation('common');
  const { setVisibleModal } = useContext(ModalContext);
  const [isShowCurPwd, setIsShowCurPwd] = useState(false);
  const [isShowNewPwd, setIsShowNewPwd] = useState(false);
  const [isShowReNewPwd, setIsShowReNewPwd] = useState(false);
  const { sectionRef, clickOutside } = useClickOutside(closePopup);
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
  const onSubmit: SubmitHandler<Form> = async (data) => {
    await handleGetCSRFCookie();
    await changePassword(data);
  };
  useEffect(() => {
    if (isSuccessChangePassword) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: 'Đổi mật khẩu thành công!',
        },
      });
      closePopup();
    }
    if (isErrorChangePassword && errorChangePassword) {
      const error = errorChangePassword as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessChangePassword,
    isErrorChangePassword,
    errorChangePassword,
    setVisibleModal,
    closePopup,
  ]);
  return (
    <section
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      onClick={() => clickOutside}
    >
      <div
        className='max-w-[540px] w-full bg-white rounded-sm overflow-hidden px-4 py-6 flex flex-col gap-6'
        ref={sectionRef as LegacyRef<HTMLDivElement>}
      >
        <div className='w-full flex justify-end'>
          <button
            aria-label='close-change-password'
            aria-disabled={isLoadingChangePassword || isLoadingCSRF}
            onClick={closePopup}
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
                  disabled={isLoadingChangePassword || isLoadingCSRF}
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowCurPwd ? 'text' : 'password'}
                  placeholder={`${t('current_password')}`}
                  {...register('current_password')}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowCurPwd(!isShowCurPwd)}
                  disabled={isLoadingChangePassword || isLoadingCSRF}
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
                  disabled={isLoadingChangePassword || isLoadingCSRF}
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowNewPwd ? 'text' : 'password'}
                  placeholder={`${t('new_password')}`}
                  {...register('password')}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowNewPwd(!isShowNewPwd)}
                  disabled={isLoadingChangePassword || isLoadingCSRF}
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
                  disabled={isLoadingChangePassword || isLoadingCSRF}
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowReNewPwd ? 'text' : 'password'}
                  placeholder={`${t('re_new_password')}`}
                  {...register('password_confirmation')}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowReNewPwd(!isShowReNewPwd)}
                  disabled={isLoadingChangePassword || isLoadingCSRF}
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
            disabled={isLoadingChangePassword || isLoadingCSRF}
          >
            {isLoadingChangePassword
              ? `...${t('loading')}`
              : t('change_password')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePasswordPopup;
