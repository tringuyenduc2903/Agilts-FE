'use client';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import { Document } from '@/types/types';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
function ListDocumentModal() {
  const { state, setVisibleModal } = useContext(ModalContext);
  const [curDocument, setCurDocument] = useState<Document | null>(null);
  const { allDocuments, defaultDocument, setDefaultDocument } =
    useContext(UserContext);
  const handleSelectedDocument = useCallback((d: Document) => {
    setCurDocument(d);
  }, []);
  const handleConfirmAddress = useCallback(() => {
    setDefaultDocument(curDocument);
    setVisibleModal('visibleListDocumentModal');
  }, [setDefaultDocument, setVisibleModal, curDocument]);
  useEffect(() => {
    if (state.visibleListDocumentModal && defaultDocument) {
      setCurDocument(defaultDocument);
    }
  }, [state.visibleListDocumentModal, defaultDocument]);
  const renderedDocuments = useMemo(() => {
    return allDocuments?.map((d) => {
      return (
        <li className='py-4 border-b border-neutral-300 flex gap-4' key={d.id}>
          <div>
            <button
              className={`relative size-4 border-2 ${
                curDocument?.id === d.id
                  ? 'border-red-500'
                  : 'border-neutral-500'
              } rounded-full`}
              aria-label='select-address'
              onClick={() => handleSelectedDocument(d)}
            >
              {d.id === curDocument?.id && (
                <span className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-2 rounded-full bg-red-500'></span>
              )}
            </button>
          </div>
          <div className='flex flex-col gap-2'>
            <p>{d.type_preview}</p>
            {d.default && (
              <p className='w-max border border-red-500 px-4 py-1 text-red-500 font-medium text-sm'>
                Mặc định
              </p>
            )}
          </div>
        </li>
      );
    });
  }, [allDocuments, curDocument, handleSelectedDocument]);
  return (
    <section
      className='fixed top-0 left-0 w-full h-full z-[9999] py-16 px-4 flex justify-center items-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='relative bg-white text-neutral-800 text-sm md:text-base px-4 py-8 rounded-sm flex flex-col gap-6 min-h-[40vh] max-h-[80vh] w-full sm:w-3/4 md:w-2/3 xl:w-1/2 overflow-y-auto'>
        <div className='flex justify-between items-center gap-2'>
          <h1 className='text-lg md:text-xl font-bold'>Danh sách hồ sơ</h1>
        </div>
        <div className='w-full h-full'>
          {renderedDocuments?.length > 0 ? (
            <ul>{renderedDocuments}</ul>
          ) : (
            <NotFoundItem message='Bạn chưa có hồ sơ nào!' />
          )}
        </div>
        <div className='absolute bottom-0 left-0 w-full h-[64px] px-4 bg-white flex justify-end items-center gap-4 border-t border-neutral-300'>
          <button
            type='button'
            className='px-4 py-2 border border-neutral-300 text-neutral-600 hover:text-neutral-800 hover:border-neutral-400 transition-colors'
            onClick={() => setVisibleModal('visibleListDocumentModal')}
          >
            Trở lại
          </button>
          <button
            type='submit'
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors'
            onClick={handleConfirmAddress}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </section>
  );
}

export default ListDocumentModal;
