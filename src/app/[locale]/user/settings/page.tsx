'use client';
import withAuth from '@/protected-page/withAuth';
import React from 'react';
import { useTranslation } from 'react-i18next';

function SettingsPage() {
  const { t } = useTranslation('common');
  return (
    <div>
      <section>
        <h1 className='text-2xl font-bold py-2'>{t('profiles')}</h1>
        <p className='text-neutral-600'>{t('mess_profiles')}</p>
      </section>
    </div>
  );
}

export default withAuth(SettingsPage);
