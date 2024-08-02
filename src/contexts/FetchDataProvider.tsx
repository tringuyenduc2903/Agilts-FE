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
  useGetDocumentsQuery,
  useGetUserQuery,
} from '@/lib/redux/query/userQuery';
import { setIsLoggedIn, setUser, userInfo } from '@/lib/redux/slice/userSlice';
import { Address, Cart, Document, User, Wishlist } from '@/types/types';
import { useGetCSRFCookieMutation } from '@/lib/redux/query/csrfQuery';
import { useGetWishlistQuery } from '@/lib/redux/query/storesQuery';
type FetchData = {
  user: User | null;
  isLoadingUser: boolean;
  isSuccessUser: boolean;
  isErrorUser: boolean;
  refetchUser: () => void;
  handleGetCSRFCookie: () => Promise<void>;
  isLoadingCSRF: boolean;
  cart: Cart | null;
  wishlist: Wishlist[] | [];
  isLoadingWishlist: boolean;
  addresses: Address[];
  isLoadingAddress: boolean;
  allDocuments: Document[];
  isLoadingDocuments: boolean;
  setAddresses: Dispatch<SetStateAction<Address[] | []>>;
  defaultAddress: Address | null;
  defaultDocument: Document | null;
};
export const FetchDataContext = createContext({} as FetchData);

export const FetchDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfo);
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<Wishlist[] | []>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  const [defaultDocument, setDefaultDocument] = useState<Document | null>(null);
  const [allDocuments, setAllDocuments] = useState<Document[] | []>([]);
  const [getCSRFCookie, { isLoading: isLoadingCSRF }] =
    useGetCSRFCookieMutation();
  const {
    data: userData,
    isSuccess: isSuccessUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useGetUserQuery(null);
  const {
    data: wishListData,
    isSuccess: isSuccessWishlist,
    isLoading: isLoadingWishlist,
  } = useGetWishlistQuery(null, { skip: !userData });
  const {
    data: addressData,
    isSuccess: isSuccessAddress,
    isLoading: isLoadingAddress,
  } = useGetAddressQuery(null, { skip: !userData });
  const {
    data: documentsData,
    isSuccess: isSuccessDocument,
    isLoading: isLoadingDocuments,
  } = useGetDocumentsQuery(null, { skip: !userData });
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
    if (isSuccessWishlist && wishListData) {
      setWishlist([...wishListData]);
    }
  }, [isSuccessWishlist, wishListData]);
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
  useEffect(() => {
    if (isSuccessDocument && documentsData) {
      setAllDocuments(
        [...documentsData].sort((a: Address, b: Address) => {
          if (a.default && !b.default) {
            return -1;
          }
          if (!a.default && b.default) {
            return 1;
          }
          return 0;
        })
      );
    }
    setDefaultDocument(documentsData?.find((d: Document) => d.default));
  }, [isSuccessDocument, documentsData]);
  const contextValue = {
    user,
    isLoadingUser,
    isSuccessUser,
    isErrorUser,
    refetchUser,
    handleGetCSRFCookie,
    isLoadingCSRF,
    cart,
    wishlist,
    isLoadingWishlist,
    defaultAddress,
    addresses,
    setAddresses,
    defaultDocument,
    allDocuments,
    isLoadingDocuments,
    isLoadingAddress,
  };
  return (
    <FetchDataContext.Provider value={contextValue}>
      {children}
    </FetchDataContext.Provider>
  );
};
