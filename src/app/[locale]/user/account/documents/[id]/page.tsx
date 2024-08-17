'use client';
import Loading from '@/app/[locale]/loading';
import { UserContext } from '@/contexts/UserProvider';
import withAuth from '@/components/protected-page/withAuth';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo } from 'react';
import { parse } from 'date-fns';
import { documents } from '@/config/config';
import { FaPenToSquare, FaRegTrashCan } from 'react-icons/fa6';
import { ModalContext } from '@/contexts/ModalProvider';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { PopupContext } from '@/contexts/PopupProvider';
import { useFetch } from '@/lib/hooks/useFetch';
import { deleteDocument } from '@/api/document';
function DocumentDetailsPage() {
  const { locale, id } = useParams();
  const router = useRouter();
  const t = useTranslations('common');
  const { refetchDocument } = useContext(UserContext);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const { allDocuments, isLoadingDocuments, isLoadingUser } =
    useContext(UserContext);
  const {
    fetchData: deleteDocumentMutation,
    isSuccess: isSuccessDelete,
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useFetch(async () => await deleteDocument(id as string));
  const curDocument = useMemo(() => {
    return allDocuments?.find((d) => d.id.toString() === id);
  }, [id, allDocuments]);
  const curType = useMemo(() => {
    if (curDocument) return documents.find((d) => d.code === curDocument.type);
    return null;
  }, [curDocument]);
  const expiryDate = useMemo(() => {
    if (curDocument?.expiry_date)
      return parse(
        curDocument?.expiry_date.toString(),
        'dd/MM/yyyy',
        new Date()
      );
    return null;
  }, [curDocument]);
  useEffect(() => {
    if (isSuccessDelete) {
      refetchDocument();
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('mess_delete_document'),
        },
      });
      router.replace(`/${locale}/user/account/documents`);
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorDelete?.message,
        },
      });
    }
  }, [
    isSuccessDelete,
    isErrorDelete,
    errorDelete,
    t,
    setVisiblePopup,
    router,
    locale,
  ]);
  if (isLoadingDocuments || isLoadingUser) return <Loading />;
  return (
    <div className='flex flex-col gap-6'>
      <section className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-xl md:text-2xl py-2 font-bold'>
            {t('document_details')}
          </h1>
          {expiryDate &&
            (new Date(expiryDate) >
            new Date(new Date().setHours(0, 0, 0, 0)) ? (
              <p className='w-max border border-green-500 text-green-500 font-bold text-sm rounded-3xl px-2 py-1'>
                {t('valid')}
              </p>
            ) : (
              <p className='w-max border border-red-500 text-red-500 font-bold text-sm rounded-3xl px-2 py-1'>
                {t('expired')}
              </p>
            ))}
        </div>
        <div className='py-2'>
          {curDocument && (
            <button
              className='px-4 py-2 sm:py-3 rounded-sm w-max h-max flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-sm md:text-base text-white'
              onClick={() =>
                setVisibleModal({
                  visibleUpdateDocumentModal: curDocument,
                })
              }
            >
              <FaPenToSquare />
              <p>{t('update_document')}</p>
            </button>
          )}
        </div>
      </section>
      {!isLoadingUser && !isLoadingDocuments && curDocument && (
        <>
          <section className='py-4 border-t border-b border-neutral-300 flex flex-col gap-4 text-sm md:text-base'>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>
                {t('created_at_record')}
              </p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.created_at}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>
                {t('updated_at_record')}
              </p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.updated_at}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>
                {t('document_number')}
              </p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.number}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>{t('document_type')}</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {t(curType?.name)}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>{t('issued_name')}</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.issued_name}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>{t('issuance_date')}</p>
              <p className='fw-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.issuance_date}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>{t('expiry_date')}</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.expiry_date}
              </p>
            </div>
          </section>
          <section className='w-full flex justify-end'>
            <button
              className='w-full md:w-max px-8 py-2 rounded-sm bg-neutral-800 hover:bg-neutral-900 transition-colors text-white font-bold text-sm md:text-base flex justify-center items-center gap-2'
              onClick={() =>
                setVisibleModal({
                  visibleConfirmModal: {
                    title: t('title_del_document'),
                    description: t('des_del_document'),
                    isLoading: isLoadingDelete,
                    cb: () => deleteDocumentMutation(),
                  },
                })
              }
            >
              {t('delete')}
              <FaRegTrashCan />
            </button>
          </section>
        </>
      )}
      {!isLoadingUser && !isLoadingDocuments && !curDocument && (
        <NotFoundItem message={t('no_document')} />
      )}
    </div>
  );
}

export default withAuth(DocumentDetailsPage);
