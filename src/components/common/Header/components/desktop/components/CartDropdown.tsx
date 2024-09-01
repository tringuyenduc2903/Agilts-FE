'use client';
import CustomImage from '@/components/ui/CustomImage';
import { UserContext } from '@/contexts/UserProvider';
import { useRouter } from 'next/navigation';
import React, { useContext, useMemo } from 'react';
type Props = {
  isOpenMenu: boolean;
  closeMenu: () => void;
};
function CartDropdown({ isOpenMenu, closeMenu }: Props) {
  const { cart } = useContext(UserContext);
  const router = useRouter();
  const renderedCart = useMemo(() => {
    return (
      (cart.length > 0 &&
        cart.map((c) => {
          return (
            <article className='px-4 w-full flex gap-8' key={c.id}>
              <div className='size-[120px]'>
                <CustomImage
                  image={c?.option?.images[0]}
                  width={120}
                  height={120}
                />
              </div>
              <div className='w-full flex flex-col gap-2'>
                <div className='flex justify-between'>
                  <p
                    title={c?.option?.product?.name}
                    className='max-w-[280px] truncate text-lg font-bold'
                  >
                    {c?.option?.product?.name}
                  </p>
                </div>
                <p className='flex items-center gap-2 uppercase text-red-500 text-sm font-bold'>
                  <span>Số lượng:</span>
                  <span>{c?.amount}</span>
                </p>
                <p className='text-start text-sm md:text-base font-bold'>
                  {c?.option?.price?.preview}
                </p>
              </div>
            </article>
          );
        })) ||
      []
    );
  }, [cart]);
  return (
    <div
      className={`absolute w-max top-[130%] right-0 bg-white border border-neutral-200 shadow ${
        isOpenMenu ? 'opacity-100 z-50' : 'opacity-0 -z-10'
      } transition-opacity duration-150`}
    >
      {renderedCart.length > 0 ? (
        <div className='flex flex-col justify-between gap-8 px-4 py-6'>
          <div className='flex flex-col gap-4 overflow-y-auto'>
            {renderedCart}
          </div>
          <div className='px-4'>
            <button
              className='w-full flex justify-center items-center bg-red-600'
              onClick={() => {
                closeMenu(), router.push(`/cart`);
              }}
            >
              <div className='relative w-[240px] h-[55px] uppercase text-white px-8 py-2 font-bold rounded-sm tracking-[2px] flex justify-center items-center text-sm'>
                <span
                  className={`w-[142px] absolute top-1/2 left-8 -translate-y-1/2 px-2 z-10 bg-red-600 transition-all duration-200 text-[12px]`}
                >
                  Xem giỏ hàng
                </span>
                <span className='w-full flex items-center'>
                  <span className='w-full h-[1px] bg-white'></span>
                  <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
                </span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className='w-full py-4 px-6 flex justify-center items-center'>
          <p className='font-bold text-lg'>Bạn chưa có sản phẩm nào!</p>
        </div>
      )}
    </div>
  );
}

export default CartDropdown;
