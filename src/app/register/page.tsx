'use client';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { useRouter } from 'next/navigation';
import Loading from '../loading';
const DynamicRegister = dynamic(() => import('./_components/Register'));
function RegisterPage() {
  const router = useRouter();
  const { isSuccessUser, isLoadingUser } = useContext(FetchDataContext);
  if (isSuccessUser && !isLoadingUser) {
    router.replace('/');
  }
  if (isLoadingUser) return <Loading />;
  return <DynamicRegister />;
}

export default RegisterPage;
