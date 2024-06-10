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
  const { user, isSuccessUser } = useContext(FetchDataContext);
  if (user || isSuccessUser) {
    router.replace('/');
  }

  return <DynamicLoginForm />;
}

export default LoginPage;
