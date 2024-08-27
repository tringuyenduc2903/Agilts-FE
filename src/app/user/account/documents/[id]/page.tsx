'use client';
import { UserContext } from '@/contexts/UserProvider';
import withAuth from '@/components/protected-page/withAuth';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo } from 'react';
import { parse } from 'date-fns';
import { documents } from '@/config/config';
import { FaPenToSquare, FaRegTrashCan } from 'react-icons/fa6';
import { ModalContext } from '@/contexts/ModalProvider';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { PopupContext } from '@/contexts/PopupProvider';
import Loading from '@/app/loading';
import { useDeleteDocumentMutation } from '@/lib/redux/query/appQuery';
function DocumentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const { allDocuments, isLoadingDocuments, isLoadingUser } =
    useContext(UserContext);
  const [
    deleteDocument,
    {
      isSuccess: isSuccessDelete,
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteDocumentMutation();
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
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Xóa hồ sơ thành công!',
        },
      });
      router.replace(`/user/account/documents`);
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorDelete as any)?.data?.message,
        },
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, setVisiblePopup, router]);
  if (isLoadingDocuments || isLoadingUser) return <Loading />;
  return (
    <div className='flex flex-col gap-6'>
      <section className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-xl md:text-2xl py-2 font-bold'>Hồ sơ chi tiết</h1>
          {expiryDate &&
            (new Date(expiryDate) >
            new Date(new Date().setHours(0, 0, 0, 0)) ? (
              <p className='w-max border border-green-500 text-green-500 font-bold text-sm rounded-3xl px-2 py-1'>
                Có hiệu lực
              </p>
            ) : (
              <p className='w-max border border-red-500 text-red-500 font-bold text-sm rounded-3xl px-2 py-1'>
                Hết hạn
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
              <p>Cập nhật hồ sơ</p>
            </button>
          )}
        </div>
      </section>
      {!isLoadingUser && !isLoadingDocuments && curDocument && (
        <>
          <section className='py-4 border-t border-b border-neutral-300 flex flex-col gap-4 text-sm md:text-base'>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>Ngày tạo</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.created_at}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>Ngày cập nhật</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.updated_at}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>Mã hồ sơ</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.number}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>Loại hồ sơ</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curType?.name}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>Nơi cấp hồ sơ</p>
              <p className='w-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.issued_name}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>Ngày cấp</p>
              <p className='fw-2/3 xl:w-4/5 font-bold flex justify-end'>
                {curDocument?.issuance_date}
              </p>
            </div>
            <div className='flex justify-between gap-4'>
              <p className='w-1/3 xl:w-1/5 font-medium'>Ngày hết hạn</p>
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
                    title: 'Bạn chắc chắn rằng mình muốn xóa hồ sơ này?',
                    description:
                      'Bạn sẽ không thể khôi phục lại bản ghi sau khi xóa hồ sơ. Hãy chắc chắn về hành động của mình.',
                    isLoading: isLoadingDelete,
                    cb: () => deleteDocument(curDocument?.id),
                  },
                })
              }
            >
              Xóa
              <FaRegTrashCan />
            </button>
          </section>
        </>
      )}
      {!isLoadingUser && !isLoadingDocuments && !curDocument && (
        <NotFoundItem message='Bạn chưa có hồ sơ nào!' />
      )}
    </div>
  );
}

export default withAuth(DocumentDetailsPage);
