'user client';
import React, { useCallback, useContext, useState } from 'react';
import Image from 'next/image';
import logo from '../.././../../../../public/logo.png';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { title } from '@/config/config';
import { UserContext } from '@/contexts/UserProvider';
import { IoCartOutline, IoPersonCircleOutline } from 'react-icons/io5';
import UserDropdown from './components/UserDropdown';
import CartDropdown from './components/CartDropdown';

function DesktopNavigation() {
  const { user, cart, isLoadingUser, isLoadingCart } = useContext(UserContext);
  const [hoverMenu, setHoverMenu] = useState<null | String>(null);
  const [dropdown, setDropdown] = useState<'user' | 'cart' | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const handleSetDropdown = useCallback((dropdown: 'user' | 'cart') => {
    setDropdown((prevDropdown) =>
      prevDropdown === dropdown ? null : dropdown
    );
  }, []);
  return (
    <header className='fixed bg-white text-neutral-800 w-full top-0 left-0 z-[999] px-8 flex justify-between h-[72px] items-center border-b border-neutral-200 shadow'>
      <button
        className='flex items-center overflow-hidden'
        aria-label='btn-back-home'
        onClick={() => router.push(`/`)}
      >
        <div className='h-[64px] overflow-hidden'>
          <Image
            className='w-full h-full object-cover'
            src={logo}
            alt='logo'
            fetchPriority='high'
          />
        </div>
        <p className='text-4xl font-bold uppercase'>
          {title?.replace('A', '')}
        </p>
      </button>
      <section className='relative z-[999] h-full flex items-center font-bold tracking-[1px]'>
        <Link
          className={`h-full uppercase flex justify-center items-center px-4 ${
            hoverMenu === 'home' ? 'bg-white' : ''
          }`}
          href={`/`}
          prefetch={true}
        >
          <p className='relative py-1'>
            <span>Trang chủ</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                hoverMenu === 'home' || pathname === '/' ? 'w-8' : 'w-0'
              } h-[2px] bg-red-500 transition-all duration-300`}
            ></span>
          </p>
        </Link>
        <Link
          className={`h-full uppercase flex justify-center items-center px-4 ${
            hoverMenu === 'motor-cycle' ? 'bg-white' : ''
          }`}
          href={`/products/motor-cycle`}
          onMouseOver={() => setHoverMenu('motor-cycle')}
          onMouseOut={() => setHoverMenu(null)}
          prefetch={true}
        >
          <p className='relative py-1'>
            <span>Xe máy</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                hoverMenu === 'motor-cycle' || pathname.includes('motor-cycle')
                  ? 'w-8'
                  : 'w-0'
              } h-[2px] bg-red-500 transition-all duration-300`}
            ></span>
          </p>
        </Link>
        <Link
          className={`h-full uppercase flex justify-center items-center px-4 ${
            hoverMenu === 'square-parts' ? 'bg-white' : ''
          }`}
          href={`/products/square-parts`}
          onMouseOver={() => setHoverMenu('square-parts')}
          onMouseOut={() => setHoverMenu(null)}
          prefetch={true}
        >
          <p className='relative py-1'>
            <span>Phụ tùng</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                hoverMenu === 'square-parts' ||
                pathname.includes('square-parts')
                  ? 'w-8'
                  : 'w-0'
              } h-[2px] bg-red-500 transition-all duration-300`}
            ></span>
          </p>
        </Link>
        <Link
          className={`h-full uppercase flex justify-center items-center px-4 ${
            hoverMenu === 'accessories' ? 'bg-white' : ''
          }`}
          href={`/products/accessories`}
          onMouseOver={() => setHoverMenu('accessories')}
          onMouseOut={() => setHoverMenu(null)}
          prefetch={true}
        >
          <p className='relative py-1'>
            <span>Phụ kiện</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                hoverMenu === 'accessories' || pathname.includes('accessories')
                  ? 'w-8'
                  : 'w-0'
              } h-[2px] bg-red-500 transition-all duration-300`}
            ></span>
          </p>
        </Link>
        <Link
          className={`h-full uppercase flex justify-center items-center px-4 ${
            hoverMenu === 'contact' ? 'bg-white' : ''
          }`}
          href={`/contact`}
          onMouseOver={() => setHoverMenu('contact')}
          onMouseOut={() => setHoverMenu(null)}
          prefetch={true}
        >
          <p className='relative py-1'>
            <span>Liên hệ chúng tôi</span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                hoverMenu === 'contact' || pathname.includes('contact')
                  ? 'w-8'
                  : 'w-0'
              } h-[2px] bg-red-500 transition-all duration-300`}
            ></span>
          </p>
        </Link>
      </section>
      <section className='h-full flex items-center gap-6'>
        {!isLoadingUser && !user && (
          <button
            className='w-max bg-red-500 text-white px-4 py-2 font-bold rounded-sm flex justify-center items-center gap-1'
            onClick={() => router.push('/login')}
          >
            <span>Đăng ký</span>
            <span>/</span>
            <span>Đăng nhập</span>
          </button>
        )}
        {!isLoadingCart && !isLoadingUser && user && (
          <div className='relative'>
            <button
              className='h-full relative z-50 flex items-center gap-2'
              onClick={() => handleSetDropdown('cart')}
            >
              <IoCartOutline className='text-3xl' />
              <span
                className={`absolute top-1/3 -translate-y-1/2 -right-2 size-5 text-white bg-red-500 rounded-full text-sm`}
              >
                {cart.length}
              </span>
            </button>
            <CartDropdown
              isOpenMenu={dropdown === 'cart'}
              closeMenu={() => setDropdown(null)}
            />
          </div>
        )}
        {(isLoadingCart || isLoadingUser) && (
          <div className='size-[40px] skeleton'></div>
        )}
        {!isLoadingUser && user && (
          <div className='relative'>
            <button
              className='flex items-center gap-2'
              onClick={() => handleSetDropdown('user')}
            >
              <IoPersonCircleOutline className='text-4xl' />
              <span>{user?.name}</span>
            </button>
            <UserDropdown
              isOpenMenu={dropdown === 'user'}
              closeMenu={() => setDropdown(null)}
            />
          </div>
        )}
        {isLoadingUser && (
          <div className='flex items-center gap-2'>
            <div className='size-[40px] skeleton rounded-full'></div>
            <div className='w-[120px] h-[24px] skeleton'></div>
          </div>
        )}
      </section>
    </header>
  );
}

export default DesktopNavigation;
