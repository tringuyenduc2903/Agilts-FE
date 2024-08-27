import dynamic from 'next/dynamic';
import Loading from './loading';
import React from 'react';
const Page = dynamic((): any => import('./_components/index'), {
  ssr: false,
  loading: () => <Loading />,
});
function SuccessOrderPage() {
  return <Page />;
}

export default SuccessOrderPage;
