'use client';
import Loading from '@/app/[locale]/loading';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { documents } from '@/config/config';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import withAuth from '@/protected-page/withAuth';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';

function DocumentsPage() {
  const t = useTranslations('common');
  const { locale } = useParams();
  const router = useRouter();
  const { setVisibleModal } = useContext(ModalContext);
  const { allDocuments, isLoadingDocuments } = useContext(FetchDataContext);
  const renderedDocuments = useMemo(() => {
    return (
      allDocuments?.map((d) => {
        const curType = documents.find((doc) => doc.code === d.type);
        return (
          <article
            className='flex flex-col gap-2 text-sm md:text-base pb-4 border-b border-neutral-300'
            key={d.id}
          >
            {d.default && (
              <p className='w-max px-2 border border-red-500 text-red-500 rounded-sm text-sm font-medium'>
                {t('default')}
              </p>
            )}
            <div className='flex flex-col lg:flex-row gap-1 justify-between lg:items-center'>
              <p className=' font-bold'>
                {t('document_number')}: <span>{d.number}</span>
              </p>
              <p>
                ({t('last_updated_at')} {d.updated_at})
              </p>
            </div>
            <p>
              {t('document_type')}:{' '}
              <span className='font-bold'>{t(curType?.name)}</span>
            </p>
            <p>
              {t('issued_name')}:{' '}
              <span className='font-bold break-words'>{d.issued_name}</span>
            </p>
            <p>
              {t('issuance_date')}:{' '}
              <span className='font-bold break-words'>{d.issuance_date}</span>
            </p>
            {/* <p>
              {t('expiry_date')}:{' '}
              <span className='font-bold'>{d.expiry_date}</span>
            </p> */}
            <div className='w-full flex justify-end'>
              <button
                className='text-sm md:text-base font-bold text-blue-500'
                onClick={() =>
                  router.push(`/${locale}/user/account/documents/${d.id}`)
                }
              >
                {t('see_details')}
              </button>
            </div>
          </article>
        );
      }) || null
    );
  }, [allDocuments, t, router, locale]);
  if (isLoadingDocuments) return <Loading />;
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
      <section className='w-full h-full flex flex-col gap-6'>
        {renderedDocuments.length ? (
          renderedDocuments
        ) : (
          <NotFoundItem message={t('mess_no_document')} />
        )}
      </section>
    </div>
  );
}

export default withAuth(DocumentsPage);
