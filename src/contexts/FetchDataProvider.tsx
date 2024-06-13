'use client';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { setUser, userInfo } from '@/lib/redux/slice/userSlice';
import { User } from '@/types/types';
import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
type FetchData = {
  user: null | User;
  isLoadingUser: boolean;
  isSuccessUser: boolean;
  isErrorUser: boolean;
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
  } = useGetUserQuery(null);
  useEffect(() => {
    if (isSuccessUser && userData) {
      dispatch(setUser(userData));
    }
    if (isErrorUser) {
      dispatch(setUser(null));
    }
  }, [dispatch, isSuccessUser, userData, isErrorUser]);
  return (
    <FetchDataContext.Provider
      value={{ user: user, isLoadingUser, isSuccessUser, isErrorUser }}
    >
      {children}
    </FetchDataContext.Provider>
  );
};
