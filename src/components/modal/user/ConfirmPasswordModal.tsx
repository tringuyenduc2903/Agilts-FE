import { ModalContext } from '@/contexts/ModalProvider';
import React, {
  LegacyRef,
  useCallback,
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
import { useFetch } from '@/lib/hooks/useFetch';
import { confirmPassword, confirmPasswordStatus } from '@/api/user';
type Form = {
  password: string;
};
function ConfirmPasswordModal() {
  const { setVisibleModal } = useContext(ModalContext);
  const t = useTranslations('common');
  const [isShowCurPwd, setIsShowCurPwd] = useState(false);
  const { setVisiblePopup } = useContext(PopupContext);
  const { sectionRef, clickOutside } = useClickOutside(() =>
    setVisibleModal('visibleConfirmPasswordModal')
  );
  const [errors, setErrors] = useState<any>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const {
    fetchData: confirmPasswordStatusMutation,
    isSuccess: isSuccessStatus,
    isError: isErrorStatus,
    error: errorStatus,
  } = useFetch(async () => await confirmPasswordStatus());
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      const res = await confirmPassword(data.password);
      if (res.type === 'error') {
        setErrors(res.data);
      } else {
        setErrors(null);
        await confirmPasswordStatusMutation();
      }
    },
    [confirmPasswordStatusMutation]
  );
  useEffect(() => {
    if (isSubmitting) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessStatus) {
      setVisibleModal({
        visibleConfirmPasswordModal: {
          state: 'success',
          display: false,
        },
      });
    }
    if (isErrorStatus && errorStatus) {
      setErrors(errorStatus);
    }
  }, [isSuccessStatus, setVisibleModal, isErrorStatus, errorStatus]);
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
        className='bg-white text-neutral-800 text-sm md:text-base px-4 py-8 rounded-sm flex flex-col justify-between gap-6 min-h-[40vh] max-h-[80vh] w-full sm:w-3/4 md:w-2/3 xl:w-1/2 overflow-y-auto'
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {isShowCurPwd ? (
              <FaRegEye className='text-xl' />
            ) : (
              <FaRegEyeSlash className='text-xl' />
            )}
          </button>
        </div>
        {errors?.errors?.password && (
          <p className='text-red-500 font-bold text-sm md:text-base'>
            {errors.errors.password[0]}
          </p>
        )}
        <button
          type='submit'
          className='mt-auto font-bold bg-neutral-800 text-white py-3 md:py-4 rounded-sm'
          disabled={isSubmitting}
        >
          {t('confirm')}
        </button>
      </form>
    </section>
  );
}

export default ConfirmPasswordModal;
