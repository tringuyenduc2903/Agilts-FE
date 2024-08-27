import React, { useContext } from 'react';
import { PopupContext } from '@/contexts/PopupProvider';

function LoadingFormPopup() {
  const { state } = useContext(PopupContext);
  return (
    <section
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className={`fixed top-0 left-0 w-full h-full z-[99999] ${
        state.visibleLoadingPopup ? 'flex' : 'hidden'
      } justify-center items-center`}
    >
      <h1 className='text-2xl md:text-4xl font-bold tracking-[4px] md:tracking-[8px] uppercase text-white'>
        Đang tải...
      </h1>
    </section>
  );
}

export default LoadingFormPopup;
