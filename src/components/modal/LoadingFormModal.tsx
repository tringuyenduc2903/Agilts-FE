import { ModalContext } from '@/contexts/ModalProvider';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

function LoadingFormModal() {
  const { t } = useTranslation('common');
  const { state } = useContext(ModalContext);
  return (
    <section
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className={`fixed top-0 left-0 w-full h-full z-[99999] ${
        state.visibleLoadingModal ? 'flex' : 'hidden'
      } justify-center items-center`}
    >
      <h1 className='text-2xl md:text-4xl font-bold tracking-[4px] md:tracking-[8px] uppercase text-white'>
        {t('loading')}...
      </h1>
    </section>
  );
}

export default LoadingFormModal;
