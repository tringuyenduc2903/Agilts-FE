'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/contexts/UserProvider';

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
        const referrerURL = document.referrer;
        console.log(currentURL, referrerURL);
        console.log(referrerURL.includes(currentURL));
        if (referrerURL.includes(currentURL)) {
          router.back();
        } else {
          router.push('/');
        }
      }
    }, [isLoadingUser, isSuccessUser, user, router]);

    if (isLoadingUser) {
      return (
        <div className='fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] bg-white flex justify-center items-center'>
          <div className='loader'></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

export default withNoAuth;
