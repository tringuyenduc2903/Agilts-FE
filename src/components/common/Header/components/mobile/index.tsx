'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import logo from '../.././../../../../public/logo.png';
import { useParams, useRouter } from 'next/navigation';
import { FaAlignRight } from 'react-icons/fa6';
import MenuRoutes from './components/MenuRoutes';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
function MobileNavigation() {
  const router = useRouter();
  const { locale } = useParams();
  const headerRef = useRef<HTMLElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          {
            translateY: -100,
          },
          {
            translateY: 0,
            duration: 0.5,
          }
        );
      }
    },
    { dependencies: [], scope: headerRef }
  );
  return (
    <>
      <header
        ref={headerRef}
        className='fixed h-[72px] w-full top-0 left-0 px-4 flex justify-between items-center z-50 bg-white shadow'
      >
        <button
          className='flex items-center overflow-hidden'
          aria-label='btn-back-home'
          onClick={() => router.push(`/${locale}`)}
        >
          <div className='w-[42px] h-[42px] overflow-hidden'>
            <Image
              width={42}
              height={42}
              className='w-full h-full object-cover'
              src={logo}
              alt='logo'
              fetchPriority='high'
              loading='eager'
            />
          </div>
          {/* <p className='text-4xl font-bold uppercase'>
            {title.replace('A', '')}
          </p> */}
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
