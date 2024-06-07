'use client';
import { useGetUserQuery } from '@/lib/redux/query/userQuery';
import { userInfo } from '@/lib/redux/slice/userSlice';
import React, { createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const FetchDataContext = createContext({});

export const FetchDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfo);
  const { data: userData, isSuccess: isSuccessUser } = useGetUserQuery(null);
  console.log(user);
  useEffect(() => {
    if (isSuccessUser && userData) {
      console.log(userData);
    }
  }, [isSuccessUser, userData]);
  return (
    <FetchDataContext.Provider value={{}}>{children}</FetchDataContext.Provider>
  );
};
