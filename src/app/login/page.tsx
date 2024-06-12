'use client';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { useRouter } from 'next/navigation';
import Loading from '../loading';
const DynamicLoginForm = dynamic(() => import('./_components/Login'), {
  ssr: false,
  loading: () => <main className='relative skeleton h-screen w-full'></main>,
});
function LoginPage() {
  const router = useRouter();
  const { isSuccessUser, isLoadingUser } = useContext(FetchDataContext);
  if (isSuccessUser && !isLoadingUser) {
    router.replace('/');
  }
  if (isLoadingUser) return <Loading />;
  return <DynamicLoginForm />;
}

export default LoginPage;
