'use client';
import { UserContext } from '@/contexts/UserProvider';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { FaPen, FaRegCircleUser } from 'react-icons/fa6';
import { TiDocument, TiLocationOutline, TiClipboard } from 'react-icons/ti';

function Aside() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useContext(UserContext);
  return (
    <aside className='lg:max-w-[360px] w-full p-4 flex flex-col lg:border-r lg:border-neutral-300'>
      <section className='border-b border-neutral-300 pb-4 overflow-hidden flex flex-col gap-4'>
        <h1 className='text-xl md:text-2xl font-bold py-2'>
          Trung tâm tài khoản
        </h1>
        <div className='flex items-center gap-4'>
          <FaRegCircleUser className='text-5xl text-neutral-600' />
          <div className='flex flex-col gap-1'>
            <h2
              title={user?.email}
              className='max-w font-bold text-base md:text-lg'
            >
              {user?.email}
            </h2>
            <button
              className='w-max text-sm md:text-base flex items-center gap-2 text-neutral-500'
              onClick={() => router.push(`/user/settings/account`)}
            >
              <FaPen />
              <p>Sửa hồ sơ</p>
            </button>
          </div>
        </div>
      </section>
      <section>
        <ul className='flex flex-col'>
          <li className='w-full'>
            <button
              className={`w-full px-4 py-3 text-sm md:text-base font-medium flex items-center justify-start gap-2 ${
                pathname.includes('documents')
                  ? 'bg-red-500 text-white'
                  : 'hover:bg-neutral-100 transition-colors'
              }`}
              onClick={() => router.push(`/user/account/documents`)}
            >
              <TiDocument className='text-2xl' />
              <p>Hồ sơ</p>
            </button>
          </li>
          <li className='w-full'>
            <button
              className={`w-full px-4 py-3 text-sm md:text-base font-medium flex items-center justify-start gap-2 ${
                pathname.includes('address')
                  ? 'bg-red-500 text-white'
                  : 'hover:bg-neutral-100 transition-colors'
              }`}
              onClick={() => router.push(`/user/account/address`)}
            >
              <TiLocationOutline className='text-2xl' />
              <p>Địa chỉ</p>
            </button>
          </li>
          <li className='w-full'>
            <button
              className={`w-full px-4 py-3 text-sm md:text-base font-medium flex items-center justify-start gap-2 ${
                pathname.includes('orders')
                  ? 'bg-red-500 text-white'
                  : 'hover:bg-neutral-100 transition-colors'
              }`}
              onClick={() => router.push(`/user/account/orders`)}
            >
              <TiClipboard className='text-2xl' />
              <p>Đơn đặt hàng</p>
            </button>
          </li>
        </ul>
      </section>
    </aside>
  );
}

export default Aside;
