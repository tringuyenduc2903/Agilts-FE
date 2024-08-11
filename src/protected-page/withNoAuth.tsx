'use client';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { UserContext } from '@/contexts/UserProvider';
function withNoAuth(Component: any) {
  return function useAuth(props: any) {
    const { isLoadingUser, isSuccessUser, user } = useContext(UserContext);
    const router = useRouter();
    if (isLoadingUser) {
      return (
        <div className='fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] bg-white flex justify-center items-center'>
          <div className='loader'></div>
        </div>
      );
    }
    if (!isLoadingUser && isSuccessUser && user) {
      return router.replace(`/`);
    }
    return <Component {...props} />;
  };
}

export default withNoAuth;
