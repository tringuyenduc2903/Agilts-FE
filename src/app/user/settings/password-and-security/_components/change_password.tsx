import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaXmark } from 'react-icons/fa6';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import { useChangePasswordMutation } from '@/lib/redux/query/appQuery';
import { UserContext } from '@/contexts/UserProvider';
type Form = {
  current_password: string;
  password: string;
  password_confirmation: string;
};
type Props = {
  closeForm: () => void;
};
const ChangePasswordPopup: React.FC<Props> = ({ closeForm }) => {
  const { getCsrfCookie, isLoadingCSRF } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<Form>();
  const { setVisiblePopup, closeAllPopup } = useContext(PopupContext);
  const [isShowCurPwd, setIsShowCurPwd] = useState(false);
  const [isShowNewPwd, setIsShowNewPwd] = useState(false);
  const [isShowReNewPwd, setIsShowReNewPwd] = useState(false);
  const [changePassword, { isSuccess, isLoading, isError, error }] =
    useChangePasswordMutation();
  const errors = useMemo(() => {
    return isError && (error as any)?.data;
  }, [isError, error]);
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await getCsrfCookie();
      await changePassword({ ...data });
    },
    [getCsrfCookie, changePassword]
  );
  useEffect(() => {
    if (isSubmitting || isLoadingCSRF || isLoading) {
      closeAllPopup();
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [
    isSubmitting || isLoadingCSRF || isLoading,
    setVisiblePopup,
    closeAllPopup,
  ]);
  useEffect(() => {
    if (isSuccess) {
      closeForm();
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `Đổi mật khẩu thành công`,
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
  }, [isSuccess, isError, error, setVisiblePopup]);
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
            disabled={isSubmitting || isLoadingCSRF || isLoading}
          >
            <FaXmark className='text-2xl' />
          </button>
        </div>
        <form
          className='w-full flex flex-col gap-6'
          onSubmit={handleSubmit(onSubmit)}
          method='POST'
        >
          <h1 className='text-2xl font-bold'>Đổi mật khẩu</h1>
          <div className='w-full flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='current_password'>Mật khẩu hiện tại</label>
              <div className='relative w-full'>
                <input
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowCurPwd ? 'text' : 'password'}
                  placeholder={`Nhập mật khẩu hiện tại`}
                  {...register('current_password')}
                  disabled={isSubmitting || isLoadingCSRF || isLoading}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowCurPwd(!isShowCurPwd)}
                  disabled={isSubmitting || isLoadingCSRF || isLoading}
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
              <label htmlFor='password'>Mật khẩu mới</label>
              <div className='relative w-full'>
                <input
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowNewPwd ? 'text' : 'password'}
                  placeholder={`Nhập mật khẩu mới`}
                  {...register('password')}
                  disabled={isSubmitting || isLoadingCSRF || isLoading}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowNewPwd(!isShowNewPwd)}
                  disabled={isSubmitting || isLoadingCSRF || isLoading}
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
                Nhập lại mật khẩu mới
              </label>
              <div className='relative w-full'>
                <input
                  className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
                  type={isShowReNewPwd ? 'text' : 'password'}
                  placeholder={`Nhập lại mật khẩu mới`}
                  {...register('password_confirmation')}
                  disabled={isSubmitting || isLoadingCSRF || isLoading}
                />
                <button
                  type='button'
                  className='absolute top-1/2 -translate-y-1/2 right-2'
                  aria-label='toggle-pwd-btn'
                  onClick={() => setIsShowReNewPwd(!isShowReNewPwd)}
                  disabled={isSubmitting || isLoadingCSRF || isLoading}
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
            disabled={isSubmitting || isLoadingCSRF || isLoading}
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChangePasswordPopup;
