'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import { UserContext } from '@/contexts/UserProvider';
import Loading from '@/app/loading';
function withAuth(Component: any) {
  return function useAuth(props: any) {
    const { isLoadingUser, user, isSuccessUser } = useContext(UserContext);
    const router = useRouter();
    useEffect(() => {
      if (!isLoadingUser && !isSuccessUser && !user) {
        router.replace(`/login`);
      }
    }, [user, isLoadingUser, isSuccessUser, router]);
    if (isLoadingUser) {
      return <Loading />;
    }
    return <Component {...props} />;
  };
}

export default withAuth;
