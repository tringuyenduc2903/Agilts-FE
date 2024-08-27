'use client';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { UserContext } from '@/contexts/UserProvider';
import { ModalContext } from '@/contexts/ModalProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import withAuth from '@/components/protected-page/withAuth';
import React, { useContext, useEffect, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa6';
import Loading from '@/app/loading';
import {
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from '@/lib/redux/query/appQuery';
function AddressPage() {
  const { addresses, isLoadingAddress } = useContext(UserContext);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [
    updateAddress,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateAddressMutation();
  const [
    deleteAddress,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteAddressMutation();
  const renderedAddress = useMemo(() => {
    return (
      addresses?.map((a) => {
        return (
          <article
            className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-300 pb-4'
            key={a.id}
          >
            <div className='text-sm md:text-base text-neutral-600 flex flex-col gap-2'>
              <p>{a.address_detail}</p>
              <p>
                {a.ward}, {a.district}, {a.province}
              </p>
              {a.default && (
                <p className='text-sm border border-red-500 text-red-500 px-1 rounded-sm w-max font-medium'>
                  Mặc định
                </p>
              )}
            </div>
            <div className='flex flex-col justify-between items-end gap-2'>
              <div className='flex justify-between items-center gap-4'>
                <button
                  className='w-max text-sm text-blue-500'
                  disabled={isLoadingUpdate}
                  onClick={() =>
                    setVisibleModal({ visibleUpdateAddressModal: a })
                  }
                >
                  Cập nhật
                </button>
                {!a.default && (
                  <button
                    className='w-max text-sm text-red-500'
                    disabled={isLoadingUpdate}
                    onClick={() =>
                      setVisibleModal({
                        visibleConfirmModal: {
                          title:
                            'Bạn chắc chắn rằng mình muốn xóa địa chỉ này?',
                          description:
                            'Bạn sẽ không thể khôi phục lại bản ghi sau khi xóa địa chỉ. Hãy chắc chắn về hành động của mình.',
                          isLoading: isLoadingDelete,
                          cb: () => deleteAddress(a?.id),
                        },
                      })
                    }
                  >
                    Xóa
                  </button>
                )}
              </div>
              <button
                disabled={a.default || isLoadingUpdate}
                className={`text-start text-sm border border-neutral-300 ${
                  a.default
                    ? 'text-neutral-600 cursor-not-allowed'
                    : 'hover:border-neutral-500 text-neutral-800 transition-colors'
                } rounded-sm px-4 py-2`}
                onClick={() =>
                  updateAddress({
                    id: a.id,
                    body: {
                      ...a,
                      default: true,
                    },
                  })
                }
              >
                Thiết lập mặc định
              </button>
            </div>
          </article>
        );
      }) || null
    );
  }, [
    addresses,
    deleteAddress,
    updateAddress,
    isLoadingDelete,
    isLoadingUpdate,
    setVisibleModal,
  ]);
  useEffect(() => {
    if (isLoadingUpdate) {
      setVisiblePopup({
        visibleLoadingPopup: true,
      });
    } else {
      setVisiblePopup({
        visibleLoadingPopup: false,
      });
    }
  }, [isLoadingUpdate, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessUpdate) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Cập nhật địa chỉ thành công!',
        },
      });
    }
    if (isErrorUpdate && errorUpdate) {
      const error = errorUpdate as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessUpdate,
    isErrorUpdate,
    errorUpdate,
    setVisiblePopup,
    setVisibleModal,
  ]);
  useEffect(() => {
    if (isSuccessDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Xóa địa chỉ thành công!',
        },
      });
    }
    if (isErrorDelete && errorDelete) {
      const error = errorDelete as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, setVisiblePopup]);
  if (isLoadingAddress) return <Loading />;

  return (
    <div className='w-full h-full flex flex-col gap-6'>
      <section className='pb-4 flex flex-col sm:flex-row justify-between sm:items-center border-b border-neutral-300'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>
          Danh sách địa chỉ
        </h1>
        <div className='flex justify-end'>
          <button
            className='px-4 py-2 sm:py-3 rounded-sm w-max h-max flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-sm md:text-base text-white'
            onClick={() => setVisibleModal('visibleAddAddressModal')}
            disabled={isLoadingUpdate}
          >
            <FaPlus />
            <p>Thêm địa chỉ</p>
          </button>
        </div>
      </section>
      <section className='w-full h-full flex flex-col gap-6'>
        {renderedAddress?.length ? (
          renderedAddress
        ) : (
          <NotFoundItem message='Bạn đang chưa có địa chỉ nào!' />
        )}
      </section>
    </div>
  );
}

export default withAuth(AddressPage);
