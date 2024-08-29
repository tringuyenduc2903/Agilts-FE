'use client';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { UserContext } from '@/contexts/UserProvider';
import Loading from '@/app/loading';
function withAuth(Component: any) {
  return function useAuth(props: any) {
    const { isLoadingUser, isErrorUser } = useContext(UserContext);
    const router = useRouter();
    if (isLoadingUser) {
      return <Loading />;
    }
    if (!isLoadingUser && isErrorUser) {
      return router.replace(`/login`);
    }
    return <Component {...props} />;
  };
}

export default withAuth;
