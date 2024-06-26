'use client';
import { ModalContext } from '@/contexts/ModalProvider';
import React, { Suspense, lazy, useContext } from 'react';
const ToastModal = lazy(() => import('./ToastModal'));
const LoadingFormModal = lazy(() => import('./LoadingFormModal'));
const ConfirmPasswordModal = lazy(() => import('./user/ConfirmPasswordModal'));
const ConfirmModal = lazy(() => import('./ConfirmModal'));
const ImageModal = lazy(() => import('./ImageModal'));
const Modal = () => {
  const { state } = useContext(ModalContext);
  return (
    <Suspense>
      {state.visibleToastModal && <ToastModal />}
      {state.visibleLoadingModal && <LoadingFormModal />}
      {state.visibleConfirmPasswordModal?.display && <ConfirmPasswordModal />}
      {state.visibleConfirmModal && <ConfirmModal />}
      {state.visibleImageModal && <ImageModal />}
    </Suspense>
  );
};

export default Modal;
