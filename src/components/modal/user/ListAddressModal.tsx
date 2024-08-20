'use client';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import { Address } from '@/types/types';
import { useTranslations } from 'next-intl';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaPlus } from 'react-icons/fa6';
function ListAddressModal() {
  const { state, setVisibleModal } = useContext(ModalContext);
  const [curAddress, setCurAddress] = useState<Address | null>(null);
  const { addresses, defaultAddress, setDefaultAddress } =
    useContext(UserContext);
  const t = useTranslations('common');
  const handleSelectedAddress = useCallback((a: Address) => {
    setCurAddress(a);
  }, []);
  const handleConfirmAddress = useCallback(() => {
    setDefaultAddress(curAddress);
    setVisibleModal('visibleListAddressModal');
  }, [setDefaultAddress, setVisibleModal, curAddress]);
  useEffect(() => {
    if (state.visibleListAddressModal && defaultAddress) {
      setCurAddress(defaultAddress);
    }
  }, [state.visibleListAddressModal, defaultAddress]);
  const renderedAddress = useMemo(() => {
    return addresses?.map((a) => {
      return (
        <li className='py-4 border-b border-neutral-300 flex gap-4' key={a.id}>
          <div>
            <button
              className={`relative size-4 border-2 ${
                curAddress?.id === a.id
                  ? 'border-red-500'
                  : 'border-neutral-500'
              } rounded-full`}
              aria-label='select-address'
              onClick={() => handleSelectedAddress(a)}
            >
              {a.id === curAddress?.id && (
                <span className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-2 rounded-full bg-red-500'></span>
              )}
            </button>
          </div>
          <div className='flex flex-col gap-2'>
            <p>{a.address_preview}</p>
            {a.default && (
              <p className='w-max border border-red-500 px-4 py-1 text-red-500 font-medium text-sm'>
                {t('default')}
              </p>
            )}
          </div>
        </li>
      );
    });
  }, [addresses, t, curAddress, handleSelectedAddress]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='relative bg-white text-neutral-800 text-sm md:text-base px-4 py-8 rounded-sm flex flex-col gap-6 min-h-[40vh] max-h-[80vh] w-full sm:w-3/4 md:w-2/3 xl:w-1/2 overflow-y-auto'>
        <div className='flex justify-between items-center gap-2'>
          <h1 className='text-lg md:text-xl font-bold'>{t('address_list')}</h1>
        </div>
        <div className='w-full h-full flex flex-col gap-6'>
          {renderedAddress?.length > 0 ? (
            <ul>{renderedAddress}</ul>
          ) : (
            <NotFoundItem message={t('mess_no_address')} />
          )}
          <button
            className='w-max border border-red-500 px-4 py-2 text-red-500 text-sm md:text-base flex justify-center items-center gap-2'
            onClick={() => setVisibleModal('visibleAddAddressModal')}
          >
            <FaPlus className='text-xl' />
            <span className='font-medium'>{t('add_address')}</span>
          </button>
        </div>
        <div className='absolute bottom-0 left-0 w-full h-[64px] px-4 bg-white flex justify-end items-center gap-4 border-t border-neutral-300'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={() => setVisibleModal('visibleListAddressModal')}
          >
            {t('return')}
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            onClick={handleConfirmAddress}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ListAddressModal;
