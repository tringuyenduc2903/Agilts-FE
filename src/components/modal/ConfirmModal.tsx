import { ModalContext } from '@/contexts/ModalProvider';
import useClickOutside from '@/lib/hooks/useClickOutside';
import React, { LegacyRef, useCallback, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { PopupContext } from '@/contexts/PopupProvider';
function ConfirmModal() {
  const { state, setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const { sectionRef, clickOutside } = useClickOutside(() =>
    setVisibleModal('visibleConfirmModal')
  );
  const t = useTranslations('common');
  const handleCallBack = useCallback(() => {
    state?.visibleConfirmModal?.cb();
    setVisiblePopup({ visibleLoadingPopup: true });
    setVisibleModal('visibleConfirmModal');
  }, [state?.visibleConfirmModal, setVisibleModal, setVisiblePopup]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={() => clickOutside}
    >
      <div
        ref={sectionRef as LegacyRef<HTMLDivElement>}
        className='max-w-[540px] w-full max-h-[50vh] overflow-y-auto bg-white rounded-sm px-4 py-6 flex flex-col gap-4'
      >
        <h1 className='text-xl md:text-2xl font-bold text-center'>
          {state?.visibleConfirmModal?.title}
        </h1>
        <p className='md:text-base text-sm'>
          {state?.visibleConfirmModal?.description}
        </p>
        <div className='flex justify-end items-center gap-4'>
          <button
            disabled={state?.visibleConfirmModal?.isLoading}
            className='text-sm md:text-base border border-red-500 bg-red-500 text-white hover:bg-red-600 transition-colors px-4 py-2 font-bold rounded-sm'
            onClick={() => setVisibleModal('visibleConfirmModal')}
          >
            {t('cancel')}
          </button>
          <button
            disabled={state?.visibleConfirmModal?.isLoading}
            className='text-sm md:text-base border border-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors px-4 py-2 font-bold rounded-sm'
            onClick={handleCallBack}
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConfirmModal;
