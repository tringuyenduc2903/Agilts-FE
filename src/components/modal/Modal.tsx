'use client';
import { ModalContext } from '@/context/ModalProvider';
import React, { Suspense, lazy, useContext } from 'react';
const ToastModal = lazy(() => import('./ToastModal'));
const Modal = () => {
  const { state } = useContext(ModalContext);
  return <Suspense>{state.visibleToastModal && <ToastModal />}</Suspense>;
};

export default Modal;
