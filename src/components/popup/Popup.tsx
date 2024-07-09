'use client';
import { PopupContext } from '@/contexts/PopupProvider';
import React, { Suspense, lazy, useContext } from 'react';
import LoadingFormPopup from './LoadingFormPopup';
const ToastPopup = lazy(() => import('./ToastPopup'));
const Popup = () => {
  const { state } = useContext(PopupContext);
  return (
    <Suspense>
      {state.visibleToastPopup && <ToastPopup />}
      {state.visibleLoadingPopup && <LoadingFormPopup />}
    </Suspense>
  );
};

export default Popup;
