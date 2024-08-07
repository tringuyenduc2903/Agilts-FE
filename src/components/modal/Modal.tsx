'use client';
import { ModalContext } from '@/contexts/ModalProvider';
import React, { Suspense, lazy, useContext } from 'react';
const ConfirmPasswordModal = lazy(() => import('./user/ConfirmPasswordModal'));
const ConfirmModal = lazy(() => import('./ConfirmModal'));
const ImageModal = lazy(() => import('./ImageModal'));
const ListAddressModal = lazy(() => import('./user/ListAddressModal'));
const AddAddressModal = lazy(() => import('./user/AddAddressModal'));
const UpdateAddressModal = lazy(() => import('./user/UpdateAddressModal'));
const AddDocumentModal = lazy(() => import('./user/AddDocumentModal'));
const ListDocumentModal = lazy(() => import('./user/ListDocumentModal'));
const UpdateDocumentModal = lazy(() => import('./user/UpdateDocumentModal'));
const ReviewModal = lazy(() => import('./user/ReviewModal'));
const Modal = () => {
  const { state } = useContext(ModalContext);
  return (
    <Suspense>
      {state.visibleConfirmPasswordModal?.display && <ConfirmPasswordModal />}
      {state.visibleConfirmModal && <ConfirmModal />}
      {state.visibleImageModal && <ImageModal />}
      {state.visibleListAddressModal && <ListAddressModal />}
      {state.visibleAddAddressModal && <AddAddressModal />}
      {state.visibleUpdateAddressModal && <UpdateAddressModal />}
      {state.visibleListDocumentModal && <ListDocumentModal />}
      {state.visibleReviewsModal && <ReviewModal />}
      {state.visibleAddDocumentModal && <AddDocumentModal />}
      {state.visibleUpdateDocumentModal && <UpdateDocumentModal />}
    </Suspense>
  );
};

export default Modal;
