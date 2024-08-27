'use client';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { documents } from '@/config/config';
import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import withAuth from '@/components/protected-page/withAuth';
import { useRouter } from 'next/navigation';
import React, { useContext, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';
import Loading from '@/app/loading';

function DocumentsPage() {
  const router = useRouter();
  const { setVisibleModal } = useContext(ModalContext);
  const { allDocuments, isLoadingDocuments } = useContext(UserContext);
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
                Mặc định
              </p>
            )}
            <div className='flex flex-col lg:flex-row gap-1 justify-between lg:items-center'>
              <p className=' font-bold'>
                Mã hồ sơ: <span>{d.number}</span>
              </p>
              <p>(Cập nhật lần cuối {d.updated_at})</p>
            </div>
            <p>
              Loại hồ sơ: <span className='font-bold'>{curType?.name}</span>
            </p>
            <p>
              Nơi cấp hồ sơ:{' '}
              <span className='font-bold break-words'>{d.issued_name}</span>
            </p>
            <p>
              Ngày cấp:{' '}
              <span className='font-bold break-words'>{d.issuance_date}</span>
            </p>
            <div className='w-full flex justify-end'>
              <button
                className='text-sm md:text-base font-bold text-blue-500'
                onClick={() => router.push(`/user/account/documents/${d.id}`)}
              >
                Xem chi tiết
              </button>
            </div>
          </article>
        );
      }) || null
    );
  }, [allDocuments, router]);
  if (isLoadingDocuments) return <Loading />;
  return (
    <div className='w-full h-full flex flex-col gap-6'>
      <section className='pb-4 flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-300'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>Danh sách hồ sơ</h1>
        <div className='flex justify-end'>
          <button
            className='px-4 py-2 sm:py-3 rounded-sm w-max h-max flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-sm md:text-base text-white'
            onClick={() => setVisibleModal('visibleAddDocumentModal')}
          >
            <FaPlus />
            <p>Thêm hồ sơ</p>
          </button>
        </div>
      </section>
      <section className='w-full h-full flex flex-col gap-6'>
        {renderedDocuments.length ? (
          renderedDocuments
        ) : (
          <NotFoundItem message='Bạn chưa có hồ sơ mặc định nào.' />
        )}
      </section>
    </div>
  );
}

export default withAuth(DocumentsPage);
