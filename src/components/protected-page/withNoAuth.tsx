'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/contexts/UserProvider';
import Loading from '@/app/loading';
import { referrerURL } from '@/config/config';

function withNoAuth(Component: any) {
  return function useAuth(props: any) {
    const { isLoadingUser, isSuccessUser, user } = useContext(UserContext);
    const router = useRouter();
    useEffect(() => {
      if (
        typeof window !== 'undefined' &&
        !isLoadingUser &&
        isSuccessUser &&
        user
      ) {
        const currentURL = process.env.NEXT_PUBLIC_CLIENT_URL as string;
        if (referrerURL.includes(currentURL)) {
          router.back();
        } else {
          router.push('/');
        }
      }
    }, [isLoadingUser, isSuccessUser, user, router]);

    if (isLoadingUser) {
      return <Loading />;
    }

    return <Component {...props} />;
  };
}

export default withNoAuth;
