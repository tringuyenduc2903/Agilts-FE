'use client';
import Image from 'next/image';
import React, { useContext, useEffect } from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import withAuth from '@/components/protected-page/withAuth';
import { UserContext } from '@/contexts/UserProvider';
import CustomImage from '@/components/ui/CustomImage';
import { PopupContext } from '@/contexts/PopupProvider';
import { useDeleteWishlistMutation } from '@/lib/redux/query/appQuery';
function WishlistPage() {
  const router = useRouter();
  const { setVisiblePopup } = useContext(PopupContext);
  const { wishlist, isLoadingWishlist } = useContext(UserContext);
  const [
    deleteWishlist,
    {
      isSuccess: isSuccessDelete,
      isLoading: isLoadingDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteWishlistMutation();
  useEffect(() => {
    if (isSuccessDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Xóa sản phẩm ra khỏi danh sách mong muốn thành công!',
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
  return (
    <main className='w-full min-h-max py-[72px] flex flex-col gap-16'>
      <section className='absolute h-[280px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-[180px] md:h-[280px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <h1 className='text-center lg:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
          Danh sách mong muốn
        </h1>
      </section>
      {!isLoadingWishlist && (
        <section className='w-full h-full container m-auto px-4'>
          {wishlist?.length > 0 ? (
            <div className='w-full overflow-x-auto text-sm md:text-base'>
              <table className='w-full whitespace-nowrap'>
                <thead>
                  <tr className='uppercase font-bold tracking-wide'>
                    <td className='px-2 py-4 text-center'>Sản phẩm</td>
                    <td className='px-2 py-4 text-center'>Màu sắc</td>
                    <td className='px-2 py-4 text-center'>Hành động</td>
                  </tr>
                </thead>
                <tbody className='border-t border-b border-neutral-300'>
                  {wishlist?.map((w) => {
                    return (
                      <tr key={w.id}>
                        <td className='px-2 py-4'>
                          <div
                            className='flex justify-center items-center gap-2 overflow-hidden cursor-pointer'
                            aria-disabled={isLoadingDelete}
                            onClick={() =>
                              router.push(`/products/${w.product_preview.id}`)
                            }
                          >
                            <div className='w-[96px] h-[96px]'>
                              <CustomImage
                                image={w.product_preview?.images[0]}
                                width={96}
                                height={96}
                              />
                            </div>
                            <p title={w.product_preview.name}>
                              {w.product_preview?.name}
                            </p>
                          </div>
                        </td>
                        <td className='px-2 py-4 text-center'>
                          {w.product_preview.color}
                        </td>
                        <td className='px-2 py-4'>
                          <div className='w-full flex justify-center gap-4'>
                            <button
                              className='hover:text-red-500 transition-colors'
                              aria-label='delete-wishlist'
                              disabled={isLoadingDelete}
                              onClick={async () => await deleteWishlist(w.id)}
                            >
                              <FaRegTrashCan className='text-xl' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='h-full flex flex-col items-center gap-6'>
              <div className='border border-neutral-300 w-full px-4 py-8 flex justify-center items-center'>
                <p className='font-bold text-neutral-800 text-base sm:text-lg md:text-xl text-center'>
                  Danh sách mong muốn của bạn hiện đang trống.
                </p>
              </div>
              <button
                className='w-max bg-red-600 rounded-sm text-white hover:bg-neutral-800 transition-colors px-4 py-4 text-sm font-bold uppercase'
                onClick={() => router.push(`/products`)}
              >
                Quay lại cửa hàng
              </button>
            </div>
          )}
        </section>
      )}
      {isLoadingWishlist && (
        <section className='container m-auto px-4 w-full h-[50vh] skeleton'></section>
      )}
    </main>
  );
}

export default withAuth(WishlistPage);
