import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import React, { useContext } from 'react';

function TwoFactorAuthenticationModal() {
  const { user } = useContext(FetchDataContext);
  const { state } = useContext(ModalContext);
  return <section>2TwoFactorAuthenticationModal</section>;
}

export default TwoFactorAuthenticationModal;
