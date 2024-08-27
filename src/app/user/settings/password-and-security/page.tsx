'use client';
import React, { useContext, useEffect, useState } from 'react';
import { FaAngleRight } from 'react-icons/fa6';
import ChangePasswordPopup from './_components/change_password';
import withAuth from '@/components/protected-page/withAuth';
import TwoFactorAuthenticationPopup from './_components/two_factor_authentication';
import { ModalContext } from '@/contexts/ModalProvider';
function PasswordAndSecurityPage() {
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
        <h1 className='text-xl md:text-2xl font-bold py-2'>
          Mật khẩu và Bảo mật
        </h1>
        <div>
          <h2 className='text-lg font-bold'>Đăng nhập & khôi phục</h2>
          <p className='text-neutral-600'>
            Quản lý mật khẩu, tùy chọn đăng nhập và phương pháp khôi phục của
            bạn.
          </p>
        </div>
      </section>
      <section className='border border-neutral-200 flex flex-col rounded-sm overflow-hidden'>
        <button
          className='p-4 flex justify-between items-center gap-4 font-medium border-b border-neutral-300 hover:bg-neutral-100 transition-colors'
          onClick={() => setCurPopup('change_password')}
        >
          <span>Đổi mật khẩu</span>
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
          <span>Xác thực 2 bước</span>
          <FaAngleRight />
        </button>
      </section>
      {curPopup === 'change_password' && (
        <ChangePasswordPopup closeForm={() => setCurPopup(null)} />
      )}
      {curPopup === 'two_factor_authentication' && (
        <TwoFactorAuthenticationPopup closeForm={() => setCurPopup(null)} />
      )}
    </div>
  );
}

export default withAuth(PasswordAndSecurityPage);
