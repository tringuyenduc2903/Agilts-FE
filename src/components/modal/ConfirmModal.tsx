import { ModalContext } from '@/contexts/ModalProvider';
import useClickOutside from '@/lib/hooks/useClickOutside';
import React, { LegacyRef, useCallback, useContext } from 'react';
import { PopupContext } from '@/contexts/PopupProvider';
function ConfirmModal() {
  const { state, setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const sectionRef = useClickOutside(() =>
    setVisibleModal('visibleConfirmModal')
  );
  const handleCallBack = useCallback(() => {
    state?.visibleConfirmModal?.cb();
    setVisiblePopup({ visibleLoadingPopup: true });
    setVisibleModal('visibleConfirmModal');
  }, [state?.visibleConfirmModal, setVisibleModal, setVisiblePopup]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={() => setVisibleModal('visibleConfirmModal')}
    >
      <div
        ref={sectionRef as LegacyRef<HTMLDivElement>}
        className='bg-white text-neutral-800 text-sm md:text-base px-4 py-8 rounded-sm flex flex-col gap-6 max-h-[40vh] w-full sm:w-3/4 md:w-2/3 xl:w-1/2 overflow-y-auto'
      >
        <h1 className='text-xl md:text-2xl font-bold text-center'>
          {state?.visibleConfirmModal?.title}
        </h1>
        <p className='md:text-base text-sm text-center'>
          {state?.visibleConfirmModal?.description}
        </p>
        <div className='flex justify-end items-center gap-4'>
          <button
            disabled={state?.visibleConfirmModal?.isLoading}
            className='text-sm md:text-base border border-red-500 bg-red-500 text-white hover:bg-red-600 transition-colors px-4 py-2 font-bold rounded-sm'
            onClick={() => setVisibleModal('visibleConfirmModal')}
          >
            Hủy
          </button>
          <button
            disabled={state?.visibleConfirmModal?.isLoading}
            className='text-sm md:text-base border border-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors px-4 py-2 font-bold rounded-sm'
            onClick={handleCallBack}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </section>
  );
}

export default ConfirmModal;
