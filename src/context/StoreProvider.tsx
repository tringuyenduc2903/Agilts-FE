'use client';
import { Provider } from 'react-redux';
import React from 'react';
import { store } from '@/lib/redux/store';
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
