'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleRight } from 'react-icons/fa6';
import ChangePasswordPopup from './_components/change_password';
import withAuth from '@/protected-page/withAuth';
import TwoFactorAuthenticationPopup from './_components/two_factor_authentication';
import { ModalContext } from '@/contexts/ModalProvider';
function PasswordAndSecurityPage() {
  const { t } = useTranslation('common');
  const { state, setVisibleModal } = useContext(ModalContext);
  const [curPopup, setCurPopup] = useState<String | null>(null);
  useEffect(() => {
    if (state.visibleConfirmPasswordModal?.state === 'success') {
      setCurPopup('two_factor_authentication');
    }
  }, [state.visibleConfirmPasswordModal?.state]);
  return (
    <div className='flex flex-col gap-8'>
      <section>
        <h1 className='text-2xl font-bold py-2'>{t('password_security')}</h1>
        <div>
          <h2 className='text-lg font-bold'>{t('login_recovery')}</h2>
          <p className='text-neutral-600'>{t('mess_login_recovery')}</p>
        </div>
      </section>
      <section className='border border-neutral-200 flex flex-col rounded-sm overflow-hidden'>
        <button
          className='p-4 flex justify-between items-center gap-4 font-medium border-b border-neutral-300 hover:bg-neutral-100 transition-colors'
          onClick={() => setCurPopup('change_password')}
        >
          <span>{t('change_password')}</span>
          <FaAngleRight />
        </button>
        <button
          className='p-4 flex justify-between items-center gap-4 font-medium hover:bg-neutral-100 transition-colors'
          onClick={() =>
            setVisibleModal({
              visibleConfirmPasswordModal: {
                state: 'idle',
                display: true,
              },
            })
          }
        >
          <span>{t('two_factor_authentication')}</span>
          <FaAngleRight />
        </button>
      </section>
      {curPopup === 'change_password' && (
        <ChangePasswordPopup closePopup={() => setCurPopup(null)} />
      )}
      {curPopup === 'two_factor_authentication' && (
        <TwoFactorAuthenticationPopup closePopup={() => setCurPopup(null)} />
      )}
    </div>
  );
}

export default withAuth(PasswordAndSecurityPage);
