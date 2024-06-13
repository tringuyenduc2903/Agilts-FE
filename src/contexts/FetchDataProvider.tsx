'use client';

import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { setIsLoggedIn, setUser, userInfo } from '@/lib/redux/slice/userSlice';
import { User } from '@/types/types';
type FetchData = {
  user: User | null;
  isLoadingUser: boolean;
  isSuccessUser: boolean;
  isErrorUser: boolean;
  refetchUser: () => void;
};
export const FetchDataContext = createContext({} as FetchData);

export const FetchDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfo);
  const {
    data: userData,
    isSuccess: isSuccessUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useGetUserQuery(null);

  useEffect(() => {
    if (isSuccessUser) {
      dispatch(setUser(userData));
      dispatch(setIsLoggedIn(true));
    } else if (isErrorUser) {
      dispatch(setUser(null));
    }
  }, [dispatch, isSuccessUser, isErrorUser, userData]);

  return (
    <FetchDataContext.Provider
      value={{
        user,
        isLoadingUser,
        isSuccessUser,
        isErrorUser,
        refetchUser,
      }}
    >
      {children}
    </FetchDataContext.Provider>
  );
};
