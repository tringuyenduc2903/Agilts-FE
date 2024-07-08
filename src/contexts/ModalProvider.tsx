'use client';
import { Address, Document } from '@/types/types';
import { createContext, useCallback, useReducer } from 'react';
type InitialState = {
  visibleToastModal: {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  };
  visibleLoadingModal: boolean;
  visibleTwoFactorAuthenticationModal: boolean;
  visibleConfirmPasswordModal: {
    // cb: () => Promise<void> | null;
    state: 'success' | 'error' | 'idle';
    display: boolean;
  };
  visibleConfirmModal: {
    title: string;
    description: string;
    isLoading: boolean;
    cb: () => void;
  };
  visibleImageModal: {
    curImage: number;
    totalImages: number;
    images: string[];
  };
  visibleAddAddressModal: boolean;
  visibleUpdateAddressModal: Address;
  visibleAddDocumentModal: boolean;
  visibleUpdateDocumentModal: Document;
};
const SET_VISIBLE_MODAL = 'SET_VISIBLE_MODAL';
const CLOSE_ALL_MODAL = 'CLOSE_ALL_MODAL';
const reducer = (state: InitialState, action: any) => {
  const currentModal = action.payload?.modal;
  const resetState = {} as InitialState;
  switch (action.type) {
    case SET_VISIBLE_MODAL:
      if (typeof action.payload?.modal === 'object') return currentModal;
      if (currentModal === null) return { ...resetState };
      return {
        ...resetState,
        [currentModal]: !state[currentModal as keyof InitialState],
      };
    case CLOSE_ALL_MODAL:
      return { ...resetState };

    default:
      return state;
  }
};
const initialState = {} as InitialState;
export type InitialModalContext = {
  state: InitialState;
  setVisibleModal: (modal: string | Partial<InitialState>) => void;
  closeAllModal: () => void;
};
export const ModalContext = createContext({} as InitialModalContext);

export const ModalProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setVisibleModal = useCallback(
    (modal: any) => {
      dispatch({ type: SET_VISIBLE_MODAL, payload: { modal } });
    },
    [dispatch]
  );
  const closeAllModal = useCallback(() => {
    dispatch({ type: CLOSE_ALL_MODAL });
  }, [dispatch]);
  const contextValue = {
    state,
    setVisibleModal,
    closeAllModal,
  };
  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};
