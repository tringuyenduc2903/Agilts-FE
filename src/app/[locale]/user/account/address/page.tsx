'use client';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import {
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/lib/redux/query/userQuery';
import withAuth from '@/protected-page/withAuth';
import { Address } from '@/types/types';
import { useTranslations } from 'next-intl';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';
function AddressPage() {
  const { addresses, defaultAddress } = useContext(FetchDataContext);
  const t = useTranslations('common');
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [updateAddress, { isLoading: isLoadingUpdate }] =
    useUpdateAddressMutation();
  const [
    deleteAddress,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteAddressMutation();
  const handleSetDefaultAddress = useCallback(
    async (address: Address) => {
      if (defaultAddress && defaultAddress?.default) {
        await Promise.all([
          updateAddress({
            body: { ...defaultAddress, default: false },
            address_id: defaultAddress.id,
          }),
          updateAddress({
            body: { ...address, default: true },
            address_id: address.id,
          }),
        ]);
      } else {
        await updateAddress({
          body: { ...address, default: true },
          address_id: address.id,
        });
      }
    },
    [updateAddress, defaultAddress]
  );
  const renderedAddress = useMemo(() => {
    return (
      addresses?.map((a) => {
        return (
          <article
            className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-300 pb-4'
            key={a.id}
          >
            <div className='text-sm md:text-base text-neutral-600 flex flex-col gap-2'>
              <p>{a.address_detail}</p>
              <p>
                {a.ward}, {a.district}, {a.province}
              </p>
              {a.default && (
                <p className='text-sm border border-red-500 text-red-500 px-1 rounded-sm w-max font-medium'>
                  {t('default')}
                </p>
              )}
            </div>
            <div className='flex flex-col justify-between items-end gap-2'>
              <div className='flex justify-between items-center gap-4'>
                <button
                  className='w-max text-sm text-blue-500'
                  disabled={isLoadingUpdate}
                  onClick={() =>
                    setVisibleModal({ visibleUpdateAddressModal: a })
                  }
                >
                  {t('update')}
                </button>
                {!a.default && (
                  <button
                    className='w-max text-sm text-red-500'
                    disabled={isLoadingUpdate}
                    onClick={() =>
                      setVisibleModal({
                        visibleConfirmModal: {
                          title: t('title_del_address'),
                          description: t('des_del_address'),
                          isLoading: isLoadingDelete,
                          cb: () => deleteAddress(a.id),
                        },
                      })
                    }
                  >
                    {t('delete')}
                  </button>
                )}
              </div>
              <button
                disabled={a.default || isLoadingUpdate}
                className={`text-start text-sm border border-neutral-300 ${
                  a.default
                    ? 'text-neutral-600 cursor-not-allowed'
                    : 'hover:border-neutral-500 text-neutral-800 transition-colors'
                } rounded-sm px-4 py-2`}
                onClick={() => handleSetDefaultAddress(a)}
              >
                {t('set_default')}
              </button>
            </div>
          </article>
        );
      }) || null
    );
  }, [
    addresses,
    t,
    deleteAddress,
    handleSetDefaultAddress,
    isLoadingDelete,
    isLoadingUpdate,
    setVisiblePopup,
    setVisibleModal,
  ]);
  useEffect(() => {
    if (isSuccessDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('delete_success_address'),
        },
      });
    }
    if (isErrorDelete && errorDelete) {
      const error = errorDelete as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, t, setVisiblePopup]);
  return (
    <div className='w-full h-full flex flex-col gap-6'>
      <section className='pb-4 flex justify-between items-center border-b border-neutral-300'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>{t('address')}</h1>
        <button
          className='px-4 py-2 sm:py-3 rounded-sm w-max h-max flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-sm md:text-base text-white'
          onClick={() => setVisibleModal('visibleAddAddressModal')}
          disabled={isLoadingUpdate}
        >
          <FaPlus />
          <p>{t('add_address')}</p>
        </button>
      </section>
      <section className='w-full h-full flex flex-col gap-6'>
        {renderedAddress?.length ? (
          renderedAddress
        ) : (
          <NotFoundItem message={t('mess_no_address')} />
        )}
      </section>
    </div>
  );
}

export default withAuth(AddressPage);
