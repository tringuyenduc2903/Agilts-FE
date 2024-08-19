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
import { useFetch } from '@/lib/hooks/useFetch';
import { getCart, getUser } from '@/api/user';
import { getAddress } from '@/api/address';
import { getDocuments } from '@/api/document';
import { getWishlist } from '@/api/wishlist';
type FetchData = {
  user: User | null;
  isLoadingUser: boolean;
  isSuccessUser: boolean;
  isErrorUser: boolean;
  isLoadingWishlist: boolean;
  isLoadingAddress: boolean;
  isLoadingDocuments: boolean;
  isLoadingCart: boolean;
  cart: Cart[] | [];
  wishlist: Wishlist[] | [];
  addresses: Address[];
  allDocuments: Document[];
  defaultAddress: Address | null;
  defaultDocument: Document | null;
  setAddresses: Dispatch<SetStateAction<Address[] | []>>;
  setDefaultAddress: Dispatch<SetStateAction<Address | null>>;
  setDefaultDocument: Dispatch<SetStateAction<Document | null>>;
  refetchUser: () => Promise<void>;
  refetchAddress: () => Promise<void>;
  refetchDocument: () => Promise<void>;
  refetchWishlist: () => Promise<void>;
  refetchCart: () => Promise<void>;
};
export const UserContext = createContext({} as FetchData);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector(userInfo);
  const [cart, setCart] = useState<Cart[] | []>([]);
  const [wishlist, setWishlist] = useState<Wishlist[] | []>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[] | []>([]);
  const [defaultDocument, setDefaultDocument] = useState<Document | null>(null);
  const [allDocuments, setAllDocuments] = useState<Document[] | []>([]);
  const {
    fetchData: fetchUser,
    data: userData,
    isSuccess: isSuccessUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    refetch: refetchUser,
  } = useFetch(async () => await getUser());
  const {
    fetchData: fetchWishlist,
    data: wishListData,
    isSuccess: isSuccessWishlist,
    isLoading: isLoadingWishlist,
    refetch: refetchWishlist,
  } = useFetch(async () => await getWishlist());
  const {
    fetchData: fetchAddress,
    data: addressData,
    isSuccess: isSuccessAddress,
    isLoading: isLoadingAddress,
    refetch: refetchAddress,
  } = useFetch(async () => await getAddress());
  const {
    fetchData: fetchDocument,
    data: documentsData,
    isSuccess: isSuccessDocument,
    isLoading: isLoadingDocuments,
    refetch: refetchDocument,
  } = useFetch(async () => await getDocuments());
  const {
    fetchData: fetchCart,
    data: cartData,
    isSuccess: isSuccessCart,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useFetch(async () => await getCart());
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    if (user) {
      Promise.allSettled([
        fetchWishlist(),
        fetchAddress(),
        fetchDocument(),
        fetchCart(),
      ]);
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
      setDefaultDocument(documentsData?.find((d: Document) => d.default));
    }
  }, [isSuccessDocument, documentsData]);
  useEffect(() => {
    if (isSuccessCart && cartData) {
      setCart(cartData);
    }
  }, [isSuccessCart, cartData]);
  const contextValue = {
    user,
    isSuccessUser,
    isErrorUser,
    cart,
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
    setDefaultDocument,
    refetchUser,
    refetchWishlist,
    refetchAddress,
    refetchDocument,
    refetchCart,
  };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
