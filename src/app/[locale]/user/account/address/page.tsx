'use client';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import withAuth from '@/protected-page/withAuth';
import { useTranslations } from 'next-intl';
import React, { useContext, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';
function Address() {
  const { addresses } = useContext(FetchDataContext);
  const t = useTranslations('common');
  const { setVisibleModal } = useContext(ModalContext);
  const renderedAddress = useMemo(() => {
    return addresses.map((a) => {
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
          <div className='flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2'>
            <button className='w-max text-sm text-blue-500'>
              {t('update')}
            </button>
            <button
              disabled={a.default}
              className={`text-start text-sm border border-neutral-300 ${
                a.default
                  ? 'text-neutral-600 cursor-not-allowed'
                  : 'hover:border-neutral-500 text-neutral-800 transition-colors'
              } rounded-sm px-4 py-2`}
            >
              {t('set_default')}
            </button>
          </div>
        </article>
      );
    });
  }, [addresses, t]);
  return (
    <div className='flex flex-col gap-6'>
      <div className='pb-4 flex justify-between items-center border-b border-neutral-300'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>{t('address')}</h1>
        <button
          className='px-4 py-2 sm:py-3 rounded-sm w-max h-max flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-sm md:text-base text-white'
          onClick={() => setVisibleModal('visibleAddAddressModal')}
        >
          <FaPlus />
          <p>{t('add_address')}</p>
        </button>
      </div>
      <div className='flex flex-col gap-6'>{renderedAddress}</div>
    </div>
  );
}

export default withAuth(Address);
