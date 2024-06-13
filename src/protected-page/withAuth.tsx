'use client';
import { notFound } from 'next/navigation';
import React, { useContext } from 'react';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import './withAuth.css';
function withAuth(Component: any) {
  return function useAuth(props: any) {
    const { isLoadingUser, isErrorUser } = useContext(FetchDataContext);
    if (isLoadingUser) {
      return (
        <div className='fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] bg-white flex justify-center items-center'>
          <div className='loader'></div>
        </div>
      );
    }
    if (!isLoadingUser && isErrorUser) {
      return notFound();
    }
    return <Component {...props} />;
  };
}

export default withAuth;
