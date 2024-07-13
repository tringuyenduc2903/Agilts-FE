import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import {
  useConfirmPasswordMutation,
  useConfirmPasswordStatusQuery,
} from '@/lib/redux/query/userQuery';
import React, {
  LegacyRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { FaRegEye, FaRegEyeSlash, FaXmark } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import useClickOutside from '@/lib/hooks/useClickOutside';
type Form = {
  password: string;
};
function ConfirmPasswordModal() {
  const { setVisibleModal } = useContext(ModalContext);
  const { handleGetCSRFCookie, isLoadingCSRF } = useContext(FetchDataContext);
  const t = useTranslations('common');
  const [isShowCurPwd, setIsShowCurPwd] = useState(false);
  const { setVisiblePopup } = useContext(PopupContext);
  const { sectionRef, clickOutside } = useClickOutside(() =>
    setVisibleModal('visibleConfirmPasswordModal')
  );
  const { register, handleSubmit } = useForm<Form>();
  const [
    confirmPassword,
    {
      isSuccess: isSuccessConfirm,
      isLoading: isLoadingConfirm,
      isError: isErrorConfirm,
      error: errorConfirm,
    },
  ] = useConfirmPasswordMutation();
  const {
    data: statusConfirm,
    isLoading: isLoadingStatus,
    isSuccess: isSuccessStatus,
    isError: isErrorStatus,
    error: errorStatus,
  } = useConfirmPasswordStatusQuery(null, {
    skip: !isSuccessConfirm,
  });
  const errors = useMemo(() => {
    if (isErrorConfirm && errorConfirm) {
      const error = errorConfirm as any;
      return error?.data?.errors;
    }
    if (isErrorStatus && errorStatus) {
      const error = errorStatus as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorConfirm, errorConfirm, isErrorStatus, errorStatus]);
  const onSubmit: SubmitHandler<Form> = async (data) => {
    await handleGetCSRFCookie();
    await confirmPassword(data.password);
  };
  useEffect(() => {
    if (isLoadingCSRF || isLoadingConfirm || isLoadingStatus) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingConfirm, isLoadingStatus, isLoadingCSRF, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessStatus && statusConfirm) {
      setVisibleModal({
        visibleConfirmPasswordModal: {
          state: 'success',
          display: false,
        },
      });
    }
  }, [isSuccessStatus, statusConfirm, setVisibleModal]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={() => clickOutside}
    >
      <form
        ref={sectionRef as LegacyRef<HTMLFormElement>}
        onSubmit={handleSubmit(onSubmit)}
        method='POST'
        className='max-w-[540px] w-full bg-white rounded-sm overflow-hidden px-4 py-6 flex flex-col gap-6'
      >
        <div className='w-full flex justify-end'>
          <button
            className='w-max'
            type='button'
            aria-label='close-modal'
            onClick={() => setVisibleModal('visibleConfirmPasswordModal')}
          >
            <FaXmark className='text-2xl' />
          </button>
        </div>
        <h1 className='text-lg md:text-xl font-bold'>
          {t('title_confirm_password')}
        </h1>
        <p> {t('mess_confirm_password')}</p>
        <div className='relative w-full'>
          <input
            disabled={isLoadingConfirm || isLoadingStatus || isLoadingCSRF}
            className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
            type={isShowCurPwd ? 'text' : 'password'}
            placeholder={`${t('current_password')}`}
            {...register('password')}
          />
          <button
            type='button'
            className='absolute top-1/2 -translate-y-1/2 right-2'
            aria-label='toggle-pwd-btn'
            onClick={() => setIsShowCurPwd(!isShowCurPwd)}
            disabled={isLoadingConfirm || isLoadingStatus || isLoadingCSRF}
          >
            {isShowCurPwd ? (
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
        <button
          type='submit'
          className='font-bold bg-neutral-800 text-white py-3 md:py-4 rounded-sm'
          disabled={isLoadingConfirm || isLoadingStatus || isLoadingCSRF}
        >
          {t('confirm')}
        </button>
      </form>
    </section>
  );
}

export default ConfirmPasswordModal;
