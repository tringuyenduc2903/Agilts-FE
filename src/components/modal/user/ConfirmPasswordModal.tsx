import { ModalContext } from '@/contexts/ModalProvider';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FaXmark } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import {
  useConfirmPasswordMutation,
  useConfirmPasswordStatusQuery,
} from '@/lib/redux/query/appQuery';
import { UserContext } from '@/contexts/UserProvider';
import CustomInputPassword from '@/components/ui/form/CustomInputPassword';
type Form = {
  password: string;
};
function ConfirmPasswordModal() {
  const { isLoadingCSRF, getCsrfCookie } = useContext(UserContext);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
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
    isSuccess: isSuccessStatus,
    isLoading: isLoadingStatus,
    isError: isErrorStatus,
    error: errorStatus,
  } = useConfirmPasswordStatusQuery(null, { skip: !isSuccessConfirm });
  const errors = useMemo(() => {
    return isErrorConfirm && (errorConfirm as any).data;
  }, [isErrorConfirm, errorConfirm]);
  const methods = useForm<Form>();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await getCsrfCookie();
      await confirmPassword({ password: data.password });
    },
    [getCsrfCookie, confirmPassword]
  );
  useEffect(() => {
    if (isSubmitting || isLoadingCSRF || isLoadingConfirm || isLoadingStatus) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [
    isSubmitting,
    isLoadingCSRF,
    isLoadingConfirm,
    isLoadingStatus,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isSuccessStatus) {
      setVisibleModal({
        visibleConfirmPasswordModal: {
          state: 'success',
          display: false,
        },
      });
    }
  }, [isSuccessStatus, setVisibleModal, isErrorStatus, errorStatus]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <FormProvider {...methods}>
        <form
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
            Vui lòng nhập lại mật khẩu của bạn
          </h1>
          <p>Để bảo mật, bạn phải nhập lại mật khẩu để tiếp tục.</p>
          <CustomInputPassword
            disabled={isSubmitting || isLoadingConfirm || isLoadingStatus}
            placeholder='Mật khẩu hiện tại'
            error={errors?.errors?.password?.[0]}
          />
          <button
            type='submit'
            className='mt-auto font-bold bg-neutral-800 text-white py-3 md:py-4 rounded-sm'
            disabled={isSubmitting || isLoadingConfirm || isLoadingStatus}
          >
            Xác nhận
          </button>
        </form>
      </FormProvider>
    </section>
  );
}

export default ConfirmPasswordModal;
