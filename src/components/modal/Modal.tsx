'use client';
import { ModalContext } from '@/contexts/ModalProvider';
import React, { Suspense, lazy, useContext } from 'react';
import ConfirmPasswordModal from './user/ConfirmPasswordModal';
const ToastModal = lazy(() => import('./ToastModal'));
const LoadingFormModal = lazy(() => import('./LoadingFormModal'));
const Modal = () => {
  const { state } = useContext(ModalContext);
  return (
    <Suspense>
      {state.visibleToastModal && <ToastModal />}
      {state.visibleLoadingModal && <LoadingFormModal />}
      {state.visibleConfirmPasswordModal?.display && <ConfirmPasswordModal />}
    </Suspense>
  );
};

export default Modal;
