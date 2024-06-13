'use client';
import { ModalContext } from '@/contexts/ModalProvider';
import React, { Suspense, lazy, useContext } from 'react';
const ToastModal = lazy(() => import('./ToastModal'));
const LoadingFormModal = lazy(() => import('./LoadingFormModal'));
const Modal = () => {
  const { state } = useContext(ModalContext);
  return (
    <Suspense>
      {state.visibleToastModal && <ToastModal />}
      {state.visibleLoadingModal && <LoadingFormModal />}
    </Suspense>
  );
};

export default Modal;
