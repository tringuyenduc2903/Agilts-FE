'use client';

import React, { createContext, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { setIsLoggedIn, setUser, userInfo } from '@/lib/redux/slice/userSlice';
import { User } from '@/types/types';
import { useGetCSRFCookieMutation } from '@/lib/redux/query/csrfQuery';
type FetchData = {
  user: User | null;
  isLoadingUser: boolean;
  isSuccessUser: boolean;
  isErrorUser: boolean;
  refetchUser: () => void;
  handleGetCSRFCookie: () => Promise<void>;
  isLoadingCSRF: boolean;
};
export const FetchDataContext = createContext({} as FetchData);

export const FetchDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfo);
  const [getCSRFCookie, { isLoading: isLoadingCSRF }] =
    useGetCSRFCookieMutation();
  const {
    data: userData,
    isSuccess: isSuccessUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useGetUserQuery(null);
  const handleGetCSRFCookie = useCallback(async () => {
    await getCSRFCookie(null);
  }, [getCSRFCookie]);
  useEffect(() => {
    if (isSuccessUser) {
      dispatch(setUser(userData));
      dispatch(setIsLoggedIn(true));
    } else if (isErrorUser) {
      dispatch(setUser(null));
    }
  }, [dispatch, isSuccessUser, isErrorUser, userData]);
  const contextValue = {
    user,
    isLoadingUser,
    isSuccessUser,
    isErrorUser,
    refetchUser,
    handleGetCSRFCookie,
    isLoadingCSRF,
  };
  return (
    <FetchDataContext.Provider value={contextValue}>
      {children}
    </FetchDataContext.Provider>
  );
};
