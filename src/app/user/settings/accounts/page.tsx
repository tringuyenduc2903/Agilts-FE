'use client';
import { CountryPhone, countries_phone } from '@/config/phone';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import { useUpdateUserMutation } from '@/lib/redux/query/userQuery';
import { formatPhoneNumberToVietnam } from '@/lib/utils/format';
import withAuth from '@/protected-page/withAuth';
import Image from 'next/image';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type Form = {
  name: string;
  email: string;
  phone_number: string | null;
  birthday: string | null;
  gender: string | number | null;
};

function AccountsPage() {
  const { t } = useTranslation('common');
  const { user, handleGetCSRFCookie, isLoadingCSRF } =
    useContext(FetchDataContext);
  const { setVisibleModal } = useContext(ModalContext);
  const [openSelectPhone, setOpenSelectPhone] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<CountryPhone | null>(null);
  const { register, handleSubmit, reset, watch } = useForm<Form>({
    defaultValues: { ...user },
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('country_phone');
      if (savedPhone) {
        setSelectedPhone(JSON.parse(savedPhone));
      } else {
        setSelectedPhone(countries_phone[0]);
      }
    }
  }, []);

  const watchedValues = watch();
  const isChangeUser = useMemo(() => {
    const string1 = JSON.stringify(user);
    const string2 = JSON.stringify(watchedValues);
    return string1 !== string2;
  }, [watchedValues, user]);

  const [
    updateUser,
    {
      // data: updateData,
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateUserMutation();

  const errors = useMemo(() => {
    if (isErrorUpdate && errorUpdate) {
      const error = errorUpdate as any;
      return error?.data?.errors;
    }
    return null;
  }, [isErrorUpdate, errorUpdate]);

  const handleSelectedPhone = useCallback((p: CountryPhone) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('country_phone', JSON.stringify(p));
    }
    setSelectedPhone(p);
    setOpenSelectPhone(false);
  }, []);

  const renderedSelectedPhone = useMemo(() => {
    return (
      <button
        type='button'
        className='flex items-center gap-2 px-2 border-r border-neutral-300'
        onClick={() => setOpenSelectPhone(!openSelectPhone)}
      >
        <div className='w-6 h-6'>
          <Image
            width={6}
            height={6}
            src={`https://flagcdn.com/${selectedPhone?.code?.toLowerCase()}.svg`}
            alt={`${selectedPhone?.name} flag`}
            className='w-full h-full object-cover'
            fetchPriority='low'
          />
        </div>
        <strong>+{selectedPhone?.phone}</strong>
      </button>
    );
  }, [selectedPhone, openSelectPhone]);

  const onSubmit: SubmitHandler<Form> = async (data) => {
    await handleGetCSRFCookie();
    await updateUser({
      ...data,
      phone_number: formatPhoneNumberToVietnam(
        selectedPhone?.phone ? selectedPhone.phone : 84,
        data.phone_number as string
      ),
    });
  };

  useEffect(() => {
    if (user) {
      reset({ ...user });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isSuccessUpdate) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: `${t('mess_change_profile')}`,
        },
      });
    }
    if (isErrorUpdate && errorUpdate) {
      const error = errorUpdate as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [isSuccessUpdate, isErrorUpdate, errorUpdate, setVisibleModal, t]);

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl py-2 font-bold'>{t('user_information')}</h1>
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
            disabled={isLoadingUpdate || isLoadingCSRF}
          />
          {errors?.name && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email'>
            Email{' '}
            {user?.email_verified_at
              ? `(${t('verified_at')} ${user?.email_verified_at})`
              : ''}
          </label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='text'
            id='email'
            {...register('email')}
            disabled
          />
          {errors?.email && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='birthday'>{t('birthday')}</label>
          <input
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base'
            type='date'
            id='birthday'
            {...register('birthday')}
            disabled={isLoadingUpdate || isLoadingCSRF}
          />
          {errors?.birthday && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.birthday[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='phone'>{t('phone')}</label>
          <div className='flex relative border border-neutral-300 rounded-sm'>
            {renderedSelectedPhone}
            <input
              className='w-full h-full px-4 py-3 text-sm md:text-base'
              type='text'
              id='phone'
              {...register('phone_number')}
              disabled={isLoadingUpdate || isLoadingCSRF}
            />
            <ul
              className={`absolute left-0 top-[150%] bg-white max-h-[30vh] ${
                openSelectPhone ? 'h-[30vh] border border-neutral-300' : 'h-0'
              } transition-[height] duration-150 overflow-y-auto z-50 rounded-sm`}
            >
              {countries_phone?.map((p: CountryPhone) => {
                return (
                  <li
                    className='w-full hover:bg-neutral-100 transition-colors'
                    key={p?.name}
                  >
                    <button
                      type='button'
                      className='w-full flex items-center gap-4 px-2 py-3 border-b border-neutral-300'
                      onClick={() => handleSelectedPhone(p)}
                    >
                      <div className='flex items-center gap-2'>
                        <span
                          className='iconify'
                          data-icon={`flag:${p?.code?.toLowerCase()}-4x3`}
                        ></span>
                        <span className='country-name'>{p?.name}</span>
                      </div>
                      <strong>+{p?.phone}</strong>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {errors?.phone_number && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.phone_number[0]}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='gender'>{t('gender')}</label>
          <select
            id='gender'
            className='w-full h-full px-4 py-3 border border-neutral-300 rounded-sm text-sm md:text-base focus:outline-none'
            {...register('gender')}
            disabled={isLoadingUpdate || isLoadingCSRF}
          >
            <option value=''>{t('select_gender')}</option>
            <option value={0}>{t('male')}</option>
            <option value={1}>{t('female')}</option>
            <option value={2}>{t('unknown')}</option>
          </select>
          {errors?.gender && (
            <p className='text-red-500 font-bold text-sm md:text-base'>
              {errors.gender[0]}
            </p>
          )}
        </div>
        <div className='flex justify-end items-center gap-4'>
          {isChangeUser && (
            <button
              className='font-bold bg-red-500 hover:bg-red-600 transition-colors text-white px-6 py-3 rounded-sm'
              type='button'
              onClick={() => reset({ ...user })}
              disabled={isLoadingUpdate || isLoadingCSRF}
            >
              {t('cancel')}
            </button>
          )}
          <button
            className='font-bold bg-neutral-800 text-white px-4 py-3 rounded-sm'
            type='submit'
            disabled={isLoadingUpdate || isLoadingCSRF}
          >
            {isLoadingUpdate || isLoadingCSRF
              ? `...${t('loading')}`
              : t('update')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default withAuth(AccountsPage);
