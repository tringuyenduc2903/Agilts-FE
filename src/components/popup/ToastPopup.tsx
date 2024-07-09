import { PopupContext } from '@/contexts/PopupProvider';
import React, { useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastPopup = () => {
  const { state } = useContext(PopupContext);
  useEffect(() => {
    if (
      state.visibleToastPopup &&
      state.visibleToastPopup.type &&
      state.visibleToastPopup.message
    ) {
      switch (state.visibleToastPopup.type) {
        case 'success':
          toast.success(state.visibleToastPopup.message);
          break;
        case 'error':
          toast.error(state.visibleToastPopup.message);
          break;
        case 'warning':
          toast.warning(state.visibleToastPopup.message);
          break;
        case 'info':
          toast.info(state.visibleToastPopup.message);
          break;
        default:
          toast(state.visibleToastPopup.message);
          break;
      }
    }
  }, [state.visibleToastPopup]);
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

export default ToastPopup;
