'use client';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { useRouter } from 'next/navigation';
const DynamicLoginForm = dynamic(() => import('./_components/Login'), {
  ssr: false,
  loading: () => <main className='relative skeleton h-screen w-full'></main>,
});
function LoginPage() {
  const router = useRouter();
  const { user, isSuccessUser, isLoadingUser } = useContext(FetchDataContext);
  if (user || isSuccessUser) {
    router.replace('/');
  }
  if (isLoadingUser)
    return <main className='relative skeleton h-screen w-full'></main>;
  return <DynamicLoginForm />;
}

export default LoginPage;
