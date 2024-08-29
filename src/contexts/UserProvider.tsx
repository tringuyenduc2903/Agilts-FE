'use client';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, userInfo } from '@/lib/redux/slice/userSlice';
import { Address, Cart, Document, User, Wishlist } from '@/types/types';
import {
  useGetAddressQuery,
  useGetCartQuery,
  useGetCsrfCookieMutation,
  useGetDocumentQuery,
  useGetUserMutation,
  useGetWishlistQuery,
} from '@/lib/redux/query/appQuery';
type FetchData = {
  isLoadingCSRF: boolean;
  getCsrfCookie: () => Promise<any>;
  user: User | null;
  isLoadingUser: boolean;
  isSuccessUser: boolean;
  refetchUser: any;
  isErrorUser: boolean;
  isLoadingWishlist: boolean;
  isLoadingAddress: boolean;
  isLoadingDocuments: boolean;
  isLoadingCart: boolean;
  cart: Cart[] | [];
  setCart: Dispatch<SetStateAction<Cart[] | []>>;
  wishlist: Wishlist[] | [];
  addresses: Address[];
  allDocuments: Document[];
  defaultAddress: Address | null;
  defaultDocument: Document | null;
  setAddresses: Dispatch<SetStateAction<Address[] | []>>;
  setDefaultAddress: Dispatch<SetStateAction<Address | null>>;
  setAllDocuments: Dispatch<SetStateAction<Document[] | []>>;
  setDefaultDocument: Dispatch<SetStateAction<Document | null>>;
};
export const UserContext = createContext({} as FetchData);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [getCsrfCookie, { isLoading: isLoadingCSRF }] =
    useGetCsrfCookieMutation();
  const dispatch = useDispatch();
  const user = useSelector(userInfo);
  const [cart, setCart] = useState<Cart[] | []>([]);
  const [wishlist, setWishlist] = useState<Wishlist[] | []>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  const [defaultDocument, setDefaultDocument] = useState<Document | null>(null);
  const [allDocuments, setAllDocuments] = useState<Document[] | []>([]);
  const [
    getUser,
    {
      data: userData,
      isSuccess: isSuccessUser,
      isLoading: isLoadingUser,
      isError: isErrorUser,
    },
  ] = useGetUserMutation();
  const {
    data: wishListData,
    isSuccess: isSuccessWishlist,
    isLoading: isLoadingWishlist,
  } = useGetWishlistQuery(null, { skip: !user });
  const {
    data: addressData,
    isSuccess: isSuccessAddress,
    isLoading: isLoadingAddress,
  } = useGetAddressQuery(null, { skip: !user });
  const {
    data: documentsData,
    isSuccess: isSuccessDocument,
    isLoading: isLoadingDocuments,
  } = useGetDocumentQuery(null, { skip: !user });
  const {
    data: cartData,
    isSuccess: isSuccessCart,
    isLoading: isLoadingCart,
  } = useGetCartQuery(null, { skip: !user });
  useEffect(() => {
    getUser(null);
  }, []);
  useEffect(() => {
    if (!user) {
      setAddresses([]);
      setAllDocuments([]);
      setDefaultAddress(null);
      setDefaultDocument(null);
      setCart([]);
      setWishlist([]);
    }
  }, [user]);
  useEffect(() => {
    if (isSuccessUser && userData) {
      dispatch(setUser(userData));
    }
    if (isErrorUser) {
      dispatch(setUser(null));
    }
  }, [dispatch, userData, isSuccessUser, isErrorUser]);
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
        [...documentsData].sort((a: Document, b: Document) => {
          if (a.default && !b.default) {
            return -1;
          }
          if (!a.default && b.default) {
            return 1;
          }
          return 0;
        })
      );
      setDefaultDocument(documentsData?.find((d: Document) => d.default));
    }
  }, [isSuccessDocument, documentsData]);
  useEffect(() => {
    if (isSuccessCart && cartData) {
      setCart(cartData);
    }
  }, [isSuccessCart, cartData]);

  const contextValue = {
    isLoadingCSRF,
    getCsrfCookie: async () => await getCsrfCookie(null),
    user,
    isSuccessUser,
    isErrorUser,
    refetchUser: getUser,
    cart,
    setCart,
    wishlist,
    defaultAddress,
    addresses,
    defaultDocument,
    allDocuments,
    isLoadingUser,
    isLoadingWishlist,
    isLoadingAddress,
    isLoadingDocuments,
    isLoadingCart,
    setAddresses,
    setDefaultAddress,
    setAllDocuments,
    setDefaultDocument,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
