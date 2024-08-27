'use client';
import withAuth from '@/components/protected-page/withAuth';
import { useRouter } from 'next/navigation';
import React from 'react';
import { GiCheckMark } from 'react-icons/gi';
function Page() {
  const router = useRouter();
  return (
    <main className='w-full py-[96px] px-4 flex justify-center items-center flex-col gap-6 sm:h-[60vh]'>
      <div className='bg-green-500 text-white rounded-full p-4 md:p-6'>
        <GiCheckMark className='text-2xl md:text-4xl' />
      </div>
      <h1 className='text-xl md:text-3xl text-center'>
        Đặt đơn hàng thành công
      </h1>
      <p className='w-full sm:w-4/5 md:w-1/2 mx-auto text-center text-neutral-500 text-sm md:text-base'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione
        voluptas neque, provident enim harum sunt assumenda laborum molestiae
        quis necessitatibus sint commodi numquam dignissimos exercitationem
        eligendi natus excepturi, atque in?
      </p>
      <div className='w-full flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6'>
        <button
          className='w-full sm:w-[242px] text-sm sm:text-base uppercase font-medium px-6 py-2 sm:py-3 border border-neutral-300 rounded-sm tracking-normal'
          onClick={() => router.push(`/user/account/orders`)}
        >
          Xem thông tin đơn hàng
        </button>
        <button
          className='w-full sm:w-[242px] text-sm sm:text-base uppercase font-medium px-6 py-2 sm:py-3 border border-green-500 bg-green-500 text-white rounded-sm tracking-normal'
          onClick={() => router.push(`/products`)}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </main>
  );
}

export default withAuth(Page);
