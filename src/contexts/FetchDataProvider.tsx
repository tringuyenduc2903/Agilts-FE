'use client';

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetAddressQuery,
  useGetUserQuery,
} from '@/lib/redux/query/userQuery';
import { setIsLoggedIn, setUser, userInfo } from '@/lib/redux/slice/userSlice';
import { Address, User } from '@/types/types';
import { useGetCSRFCookieMutation } from '@/lib/redux/query/csrfQuery';
type FetchData = {
  user: User | null;
  addresses: Address[];
  defaultAddress: Address | null;
  setAddresses: Dispatch<SetStateAction<Address[] | []>>;
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
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  const [getCSRFCookie, { isLoading: isLoadingCSRF }] =
    useGetCSRFCookieMutation();
  const {
    data: userData,
    isSuccess: isSuccessUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useGetUserQuery(null);
  const { data: addressData, isSuccess: isSuccessAddress } = useGetAddressQuery(
    null,
    { skip: !userData }
  );
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
  useEffect(() => {
    if (isSuccessAddress && addressData) {
      setAddresses(
        [...addressData].sort((a: Address, b: Address) => {
          if (a.default && !b.default) {
            return -1;
          }
          if (!a.default && b.default) {
            return 1;
          }
          return 0;
        })
      );
      setDefaultAddress(addressData?.find((a: Address) => a.default));
    }
  }, [isSuccessAddress, addressData]);
  const contextValue = {
    user,
    isLoadingUser,
    isSuccessUser,
    isErrorUser,
    refetchUser,
    handleGetCSRFCookie,
    isLoadingCSRF,
    addresses,
    setAddresses,
    defaultAddress,
  };
  return (
    <FetchDataContext.Provider value={contextValue}>
      {children}
    </FetchDataContext.Provider>
  );
};
