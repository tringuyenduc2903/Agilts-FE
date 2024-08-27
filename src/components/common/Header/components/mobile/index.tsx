'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '../.././../../../../public/logo.png';
import { useRouter } from 'next/navigation';
import { FaAlignRight } from 'react-icons/fa6';
import MenuRoutes from './components/MenuRoutes';
function MobileNavigation() {
  const router = useRouter();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  return (
    <>
      <header className='fixed h-[72px] w-full top-0 left-0 px-4 flex justify-between items-center bg-white shadow z-[999]'>
        <button
          className='flex items-center overflow-hidden'
          aria-label='btn-back-home'
          onClick={() => router.push(``)}
        >
          <div className='w-[42px] h-[42px] overflow-hidden'>
            <Image
              width={42}
              height={42}
              className='w-full h-full object-cover'
              src={logo}
              alt='logo'
              fetchPriority='high'
            />
          </div>
        </button>
        <button
          onClick={() => setIsOpenMenu(true)}
          aria-label='open-menu-routes'
        >
          <FaAlignRight className='text-2xl' />
        </button>
      </header>
      <MenuRoutes
        isOpenMenu={isOpenMenu}
        closeMenu={() => setIsOpenMenu(false)}
      />
    </>
  );
}

export default MobileNavigation;
