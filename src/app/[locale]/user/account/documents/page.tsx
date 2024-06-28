'use client';
import { ModalContext } from '@/contexts/ModalProvider';
import withAuth from '@/protected-page/withAuth';
import { useTranslations } from 'next-intl';
import React, { useContext } from 'react';
import { FaPlus } from 'react-icons/fa6';

function DocumentsPage() {
  const t = useTranslations('common');
  const { setVisibleModal } = useContext(ModalContext);
  return (
    <div className='w-full h-full flex flex-col gap-6'>
      <section className='pb-4 flex justify-between items-center border-b border-neutral-300'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>
          {t('document_list')}
        </h1>
        <button
          className='px-4 py-2 sm:py-3 rounded-sm w-max h-max flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-sm md:text-base text-white'
          onClick={() => setVisibleModal('visibleAddDocumentModal')}
        >
          <FaPlus />
          <p>{t('add_document')}</p>
        </button>
      </section>
    </div>
  );
}

export default withAuth(DocumentsPage);
