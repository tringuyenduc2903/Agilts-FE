'use client';
import 'react-phone-number-input/style.css';
import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import withAuth from '@/components/protected-page/withAuth';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { defaultTimezone } from '@/config/config';
import { SocialProvider } from '@/types/types';
import { Social } from '@/types/types';
import { FaFacebook, FaGoogle, FaGithub } from 'react-icons/fa6';
import { PopupContext } from '@/contexts/PopupProvider';
import { useFetch } from '@/lib/hooks/useFetch';
import {
  deleteSocial,
  getSocials,
  resendVerifyAccount,
  updateUser,
} from '@/api/user';
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
  const t = useTranslations('common');
  const { user, refetchUser } = useContext(UserContext);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const {
    fetchData: resendVerifyAccountMutation,
    isLoading: isLoadingPostData,
    isSuccess: isSuccessPostData,
    isError: isErrorPostData,
    error: errorPostData,
  } = useFetch(async () => await resendVerifyAccount());
  const {
    fetchData: fetchSocials,
    data: socialData,
    isSuccess: isSuccessSocial,
    refetch: refetchSocials,
  } = useFetch(async () => await getSocials());
  const [socialId, setSocialId] = useState<string | number | null>(null);
  const {
    fetchData: deleteSocialMutation,
    isSuccess: isSuccessDelete,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useFetch(async () => await deleteSocial(socialId as number));
  const [errors, setErrors] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm<Form>({
    defaultValues: { ...user, timezone: defaultTimezone },
  });

  const watchedValues = watch();
  const isChangeUser = useMemo(() => {
    const string1 = JSON.stringify(user);
    const string2 = JSON.stringify(watchedValues);
    return string1 !== string2;
  }, [watchedValues, user]);

  const handleResendVerify = useCallback(async () => {
    await resendVerifyAccountMutation();
  }, [resendVerifyAccountMutation]);
  const handleDeleteSocial = useCallback(
    async (id: string | number) => {
      setSocialId(id);
      await deleteSocialMutation();
    },
    [deleteSocialMutation]
  );
  const onSubmit: SubmitHandler<Form> = useCallback(
    async (data) => {
      const res = await updateUser({ ...data });
      if (res.type === 'error') {
        setErrors(res.data);
        setSuccess(null);
      }
      if (res.type === 'success') {
        setSuccess('success');
        setErrors(null);
        await refetchUser();
      }
    },
    [updateUser, refetchUser]
  );
  useEffect(() => {
    fetchSocials();
  }, []);
  useEffect(() => {
    if (user) {
      reset({ ...user });
    }
  }, [user, reset]);
  useEffect(() => {
    if (isSubmitting) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isSubmitting, setVisiblePopup]);
  useEffect(() => {
    if (success && !isSubmitting) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('mess_change_profile')}`,
        },
      });
    }
    if (errors && !isSubmitting) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errors?.message,
        },
      });
    }
  }, [success, errors, isSubmitting, setVisiblePopup, t]);
  useEffect(() => {
    if (isSuccessPostData) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('mess_success_send_verify')}`,
        },
      });
    }
    if (isErrorPostData && errorPostData) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorPostData?.message,
        },
      });
    }
  }, [isSuccessPostData, isErrorPostData, errorPostData, setVisiblePopup, t]);
  useEffect(() => {
    if (isSuccessDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('delete_success_social')}`,
        },
      });
      refetchSocials();
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorDelete?.message,
        },
      });
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    errorDelete,
    refetchSocials,
    setVisiblePopup,
    t,
  ]);
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>
          {t('user_information')}
        </h1>
        <p>
          ({t('last_updated_at')} {user?.updated_at})
        </p>
      </div>
      <form
        className='flex flex-col gap-4'
        onSubmit={handleSubmit(onSubmit)}
        method='POST'
      >
        <div className='flex flex-col gap-2'>
          <label htmlFor='name'>{t('name')}</label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='text'
            id='name'
            {...register('name')}
            disabled={isSubmitting || isLoadingPostData}
          />
          {errors?.errors?.name && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors?.errors.name[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='flex flex-col sm:flex-row gap-2' htmlFor='email'>
            <span>Email</span>
            {user?.email_verified_at ? (
              <span className='font-bold'>
                ({t('verified_at')} {user?.email_verified_at})
              </span>
            ) : (
              <>
                <span className='font-bold'>({t('not_verified')})</span>
                <button
                  type='button'
                  className='w-max sm:ml-auto text-red-500 font-bold'
                  onClick={handleResendVerify}
                  disabled={isSubmitting || isLoadingPostData}
                >
                  {t('verify')}
                </button>
              </>
            )}
          </label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='text'
            id='email'
            {...register('email')}
            disabled
          />
          {errors?.errors?.email && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors?.errors?.email[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <p>
            {t('socials')}{' '}
            {isSuccessSocial && socialData?.length === 0 && (
              <span className='font-bold'>({t('no_social')})</span>
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
                          title: `${t('title_del_social')}`,
                          description: `${t('des_del_social')}`,
                          isLoading: isLoadingDelete,
                          cb: () => handleDeleteSocial(s.id),
                        },
                      })
                    }
                    disabled={isSubmitting || isLoadingPostData}
                  >
                    {t('unlink')}
                  </button>
                </div>
              );
            })}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='birthday'>{t('birthday')}</label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='date'
            id='birthday'
            {...register('birthday')}
            disabled={isSubmitting || isLoadingPostData}
          />
          {errors?.birthday && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.birthday[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='phone'>
            {t('phone')}{' '}
            <span className='font-bold'>({t('support_phone_vn')})</span>
          </label>
          <PhoneInputWithCountry
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base focus:outline-none'
            name='phone_number'
            control={control}
            defaultCountry='VN'
            defaultValue={watchedValues.phone_number as string}
            disabled={isSubmitting || isLoadingPostData}
          />
          {errors?.errors?.phone_number && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors?.errors?.phone_number[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='gender'>{t('gender')}</label>
          <select
            id='gender'
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base focus:outline-none'
            {...register('gender')}
            disabled={isSubmitting || isLoadingPostData}
          >
            <option value=''>{t('select_gender')}</option>
            <option value={0}>{t('male')}</option>
            <option value={1}>{t('female')}</option>
            <option value={2}>{t('unknown')}</option>
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
              disabled={isSubmitting || isLoadingPostData}
            >
              {t('cancel')}
            </button>
          )}
          <button
            className='font-bold bg-neutral-800 text-white px-4 py-3 rounded-sm'
            type='submit'
            disabled={isSubmitting || isLoadingPostData}
          >
            {t('update')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(AccountsPage);
