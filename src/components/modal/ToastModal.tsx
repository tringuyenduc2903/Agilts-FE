import { ModalContext } from '@/contexts/ModalProvider';
import React, { useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastModal = () => {
  const { state } = useContext(ModalContext);
  useEffect(() => {
    if (
      state.visibleToastModal &&
      state.visibleToastModal.type &&
      state.visibleToastModal.message
    ) {
      switch (state.visibleToastModal.type) {
        case 'success':
          toast.success(state.visibleToastModal.message);
          break;
        case 'error':
          toast.error(state.visibleToastModal.message);
          break;
        case 'warning':
          toast.warning(state.visibleToastModal.message);
          break;
        case 'info':
          toast.info(state.visibleToastModal.message);
          break;
        default:
          toast(state.visibleToastModal.message);
          break;
      }
    }
  }, [state.visibleToastModal]);
  return (
    <ToastContainer
      limit={1}
      className='text-sm md:text-base'
      position='bottom-right'
      autoClose={3000}
      closeOnClick
      pauseOnFocusLoss
    />
  );
};

export default ToastModal;
