'use client';
import 'react-phone-number-input/style.css';
import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import withAuth from '@/components/protected-page/withAuth';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { defaultTimezone } from '@/config/config';
import { SocialProvider } from '@/types/types';
import { Social } from '@/types/types';
import { FaFacebook, FaGoogle, FaGithub } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import {
  useDeleteSocialMutation,
  useGetSocialsQuery,
  useResendVerifyAccountMutation,
  useUpdateUserMutation,
} from '@/lib/redux/query/appQuery';
import CustomInputText from '@/components/ui/form/CustomInputText';
type Form = {
  name: string;
  email: string;
  phone_number: string | null;
  birthday: string | null;
  gender: string | number | null;
  timezone: string;
};
const socials: Social = {
  facebook: {
    name: 'facebook',
    element: <FaFacebook className='text-blue-500 text-2xl' />,
  },
  google: {
    name: 'google',
    element: <FaGoogle className='text-red-500 text-2xl' />,
  },
  github: {
    name: 'github',
    element: <FaGithub className='text-neutral-800 text-2xl' />,
  },
};
function AccountsPage() {
  const { user, getCsrfCookie, isLoadingCSRF } = useContext(UserContext);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [
    resendVerifyAccount,
    {
      isLoading: isLoadingPostData,
      isSuccess: isSuccessPostData,
      isError: isErrorPostData,
      error: errorPostData,
    },
  ] = useResendVerifyAccountMutation();
  const { data: socialData, isSuccess: isSuccessSocial } =
    useGetSocialsQuery(null);
  const [
    deleteSocial,
    {
      isSuccess: isSuccessDelete,
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteSocialMutation();
  const [
    updateUser,
    {
      isSuccess: isSuccessUpdate,
      isLoading: isLoadingUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateUserMutation();
  const errors = useMemo(() => {
    return isErrorUpdate && (errorUpdate as any)?.data;
  }, [isErrorUpdate, errorUpdate]);
  const methods = useForm<Form>({
    defaultValues: { ...user, timezone: defaultTimezone },
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isSubmitting },
  } = methods;

  const watchedValues = watch();
  const isChangeUser = useMemo(() => {
    const string1 = JSON.stringify(user);
    const string2 = JSON.stringify(watchedValues);
    return string1 !== string2;
  }, [watchedValues, user]);

  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      await getCsrfCookie();
      await updateUser({ ...data });
    },
    [getCsrfCookie, updateUser]
  );
  useEffect(() => {
    if (user) {
      reset({ ...user });
    }
  }, [user, reset]);
  useEffect(() => {
    if (
      isSubmitting ||
      isLoadingCSRF ||
      isLoadingPostData ||
      isLoadingDelete ||
      isLoadingUpdate
    ) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [
    isSubmitting,
    isLoadingCSRF,
    isLoadingPostData,
    isLoadingDelete,
    isLoadingUpdate,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isSuccessUpdate) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `Cập nhật thông tin tài khoản thành công!`,
        },
      });
    }
    if (isErrorUpdate && errorUpdate) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorUpdate as any)?.data?.message,
        },
      });
    }
  }, [isSuccessUpdate, isErrorUpdate, errorUpdate, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessPostData) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `Vui lòng kiểm tra lại email!`,
        },
      });
    }
    if (isErrorPostData && errorPostData) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorPostData as any)?.data?.message,
        },
      });
    }
  }, [isSuccessPostData, isErrorPostData, errorPostData, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessDelete) {
      setVisibleModal('visibleConfirmModal');
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `Gỡ mạng xã hội thành công`,
        },
      });
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorDelete as any)?.data?.message,
        },
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, setVisiblePopup]);
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>
          Thông tin người dùng
        </h1>
        <p>(Cập nhật lần cuối {user?.updated_at})</p>
      </div>
      <FormProvider {...methods}>
        <form
          className='flex flex-col gap-4'
          onSubmit={handleSubmit(onSubmit)}
          method='POST'
        >
          <div className='flex flex-col gap-2'>
            <label htmlFor='name'>Họ và tên</label>
            <CustomInputText
              form_name='name'
              type='text'
              placeholder='Nhập họ và tên'
              error={errors?.errors?.name?.[0]}
              disabled={
                isSubmitting ||
                isLoadingCSRF ||
                isLoadingPostData ||
                isLoadingDelete
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='flex flex-col sm:flex-row gap-2' htmlFor='email'>
              <span>Email</span>
              {user?.email_verified_at ? (
                <span className='font-bold'>
                  (Đã xác minh vào {user?.email_verified_at})
                </span>
              ) : (
                <>
                  <span className='font-bold'>
                    (Địa chỉ chưa được xác minh)
                  </span>
                  <button
                    type='button'
                    className='w-max sm:ml-auto text-red-500 font-bold'
                    onClick={resendVerifyAccount}
                    disabled={
                      isSubmitting || isLoadingPostData || isLoadingDelete
                    }
                  >
                    Xác minh
                  </button>
                </>
              )}
            </label>
            <CustomInputText
              form_name='email'
              type='email'
              placeholder='Email'
              error={errors?.errors?.email?.[0]}
              disabled
            />
          </div>
          <div className='flex flex-col gap-2'>
            <p>
              Mạng xã hội{' '}
              {isSuccessSocial && socialData?.length === 0 && (
                <span className='font-bold'>(Không có mạng xã hội nào!)</span>
              )}
            </p>
            {isSuccessSocial &&
              socialData?.length > 0 &&
              socialData?.map((s: SocialProvider) => {
                return (
                  <div
                    className='flex justify-between items-center gap-6'
                    key={s.id}
                  >
                    <div className='flex items-center gap-2'>
                      <p className='text-sm md:text-base capitalize font-bold'>
                        {socials[s.provider_name].name}:
                      </p>
                      {socials[s.provider_name].element}
                    </div>
                    <button
                      className='text-sm text-blue-500'
                      type='button'
                      onClick={() =>
                        setVisibleModal({
                          visibleConfirmModal: {
                            title: `Gỡ mạng xã hội này?`,
                            description: `Bạn không thể khôi phục lại sau khi đã gỡ mạng xã hội này ra khỏi chính tài khoản của mình.`,
                            isLoading: isLoadingDelete,
                            cb: async () => await deleteSocial(s.id),
                          },
                        })
                      }
                      disabled={
                        isSubmitting || isLoadingPostData || isLoadingDelete
                      }
                    >
                      Gỡ
                    </button>
                  </div>
                );
              })}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='birthday'>Ngày sinh</label>
            <input
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
              type='date'
              id='birthday'
              {...register('birthday')}
              disabled={
                isSubmitting ||
                isLoadingCSRF ||
                isLoadingPostData ||
                isLoadingDelete
              }
            />
            {errors?.errors?.birthday && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors.birthday[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='phone'>
              Số điện thoại{' '}
              <span className='font-bold'>(Chỉ hỗ trợ Việt Nam)</span>
            </label>
            <PhoneInputWithCountry
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base focus:outline-none'
              name='phone_number'
              control={control}
              defaultCountry='VN'
              defaultValue={watchedValues.phone_number as string}
              disabled={
                isSubmitting ||
                isLoadingCSRF ||
                isLoadingPostData ||
                isLoadingDelete
              }
            />
            {errors?.errors?.phone_number && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors?.errors?.phone_number[0]}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='gender'>Giói tính</label>
            <select
              id='gender'
              className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base focus:outline-none'
              {...register('gender')}
              disabled={
                isSubmitting ||
                isLoadingCSRF ||
                isLoadingPostData ||
                isLoadingDelete
              }
            >
              <option value=''>Chọn giới tính</option>
              <option value={0}>Nam</option>
              <option value={1}>Nữ</option>
              <option value={2}>Không xác định</option>
            </select>
            {errors?.errors?.gender && (
              <p className='text-red-500 font-bold text-sm md:text-base'>
                {errors?.errors.gender[0]}
              </p>
            )}
          </div>
          <div className='flex justify-end items-center gap-4'>
            {isChangeUser && (
              <button
                className='font-bold bg-red-500 hover:bg-red-600 transition-colors text-white px-6 py-3 rounded-sm'
                type='button'
                onClick={() => reset({ ...user })}
                disabled={
                  isSubmitting ||
                  isLoadingCSRF ||
                  isLoadingPostData ||
                  isLoadingDelete
                }
              >
                Hủy
              </button>
            )}
            <button
              className='font-bold bg-neutral-800 text-white px-4 py-3 rounded-sm'
              type='submit'
              disabled={
                isSubmitting ||
                isLoadingCSRF ||
                isLoadingPostData ||
                isLoadingDelete
              }
            >
              Cập nhật
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default withAuth(AccountsPage);
