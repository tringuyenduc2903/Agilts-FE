'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoShieldOutline, IoPersonCircleOutline } from 'react-icons/io5';

function Aside() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation('common');
  return (
    <aside className='lg:max-w-[360px] p-4 flex flex-col gap-8 lg:border-r lg:border-neutral-300'>
      <section>
        <h1 className='text-2xl font-bold py-2'>{t('accounts_center')}</h1>
        <p className='text-neutral-600'>{t('mess_accounts_center')}</p>
      </section>
      <section className='flex flex-col'>
        <h2 className='text-xl font-bold py-2'>{t('account_settings')}</h2>
        <div className='w-full'>
          <button
            className={`w-full flex items-center gap-2 p-4 rounded-sm ${
              pathname.includes('password-and-security')
                ? 'bg-red-500 text-white'
                : 'hover:bg-red-50'
            } transition-colors`}
            onClick={() => router.push('/user/settings/password-and-security')}
          >
            <IoShieldOutline className='text-2xl' />
            <span className='font-medium'>{t('password_security')}</span>
          </button>
          <button
            className={`w-full flex items-center gap-2 p-4 rounded-sm ${
              pathname.includes('accounts')
                ? 'bg-red-500 text-white'
                : 'hover:bg-red-50'
            } transition-colors`}
          >
            <IoPersonCircleOutline className='text-2xl' />
            <span className='font-medium'>{t('accounts')}</span>
          </button>
        </div>
      </section>
    </aside>
  );
}

export default Aside;
