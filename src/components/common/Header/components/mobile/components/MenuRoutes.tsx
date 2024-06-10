'use client';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { userInfo } from '@/lib/redux/slice/userSlice';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { LegacyRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaXmark, FaAngleRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
type Props = {
  isOpenMenu: boolean;
  closeMenu: () => void;
};
const MenuRoutes: React.FC<Props> = ({ isOpenMenu, closeMenu }) => {
  const user = useSelector(userInfo);
  const { t } = useTranslation('header');
  const router = useRouter();
  const pathname = usePathname();
  const [hoverRoute, setHoverRoute] = useState<null | String>(null);
  const [subRoute, setSubRoute] = useState<null | String>(null);
  const [hoverSubRoute, setHoverSubRoute] = useState<null | String>(null);
  const { sectionRef } = useClickOutside(closeMenu);
  const handleRedirect = useCallback(
    (link: string) => {
      router.push(`${link}`);
      closeMenu();
    },
    [router, closeMenu]
  );
  return (
    <aside
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className={`fixed top-0 left-0 h-full w-full z-[100] ${
        isOpenMenu ? 'translate-x-0' : '-translate-x-[100%]'
      } transition-transform duration-200`}
      // onClick={closeMenu}
    >
      <div
        ref={isOpenMenu ? (sectionRef as LegacyRef<HTMLDivElement>) : null}
        className='sm:w-2/3 md:w-1/2 h-full bg-white p-4 flex flex-col gap-6'
      >
        <div className='pb-4 border-b border-neutral-300 flex justify-between'>
          {user ? (
            <div></div>
          ) : (
            <button
              className='bg-red-600 text-white px-8 py-2 tracking-[2px] text-base font-bold rounded-sm'
              onClick={() => handleRedirect('login')}
            >
              {t('login')}
            </button>
          )}
          <button aria-label='close-menu-routes' onClick={closeMenu}>
            <FaXmark className='text-2xl' />
          </button>
        </div>
        <div className='font-medium flex flex-col gap-4'>
          <Link
            className={`h-full uppercase ${
              hoverRoute === 'home' || pathname === '/' ? 'text-red-500' : ''
            } transition-colors`}
            href={'/'}
            onClick={() => handleRedirect('/')}
            onMouseEnter={() => setHoverRoute('home')}
            onMouseLeave={() => setHoverRoute(null)}
          >
            <p className='relative py-1'>
              <span>{t('home')}</span>
            </p>
          </Link>
          <div
            className={`cursor-pointer ${
              hoverRoute === 'pages' ||
              ['/about-us', '/our-services', '/contact-us'].includes(pathname)
                ? 'text-red-500'
                : ''
            } transition-colors`}
            onClick={() =>
              setSubRoute((prevState) => {
                if (prevState === 'pages') return null;
                return 'pages';
              })
            }
            onMouseEnter={() => setHoverRoute('pages')}
            onMouseLeave={() => setHoverRoute(null)}
          >
            <button className='w-full uppercase flex justify-between items-center gap-8'>
              <p className='relative py-1'>
                <span>{t('pages')}</span>
              </p>
              <FaAngleRight
                className={`${
                  subRoute === 'pages' ? 'rotate-90' : 'rotate-0'
                } transition-all duration-100 text-sm`}
              />
            </button>
            <ul
              className={` ${
                subRoute === 'pages' ? 'h-[180px]' : 'h-0'
              } transition-[height] duration-200 bg-white text-neutral-500 uppercase overflow-hidden`}
            >
              <li className='w-full px-2 text-sm'>
                <Link
                  className='relative w-full h-[48px] flex items-center gap-2 px-4'
                  href={'/about-us'}
                  onClick={() => handleRedirect('/about-us')}
                  onMouseOver={() => setHoverSubRoute('about-us')}
                  onMouseOut={() => setHoverSubRoute(null)}
                >
                  <span className='w-6 h-[2px] bg-red-600'></span>
                  <span
                    className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                      hoverSubRoute === 'about-us' || pathname === '/about-us'
                        ? 'translate-x-[20%]'
                        : 'translate-x-0'
                    } bg-white transition-all duration-300`}
                  >
                    {t('about-us')}
                  </span>
                </Link>
              </li>
              <li className='w-full px-2 text-sm'>
                <Link
                  className='relative w-full h-[48px] flex items-center gap-2 px-4'
                  href={'/our-services'}
                  onClick={() => handleRedirect('/our-services')}
                  onMouseOver={() => setHoverSubRoute('our-services')}
                  onMouseOut={() => setHoverSubRoute(null)}
                >
                  <span className='w-6 h-[2px] bg-red-600'></span>
                  <span
                    className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                      hoverSubRoute === 'our-services' ||
                      pathname === '/our-services'
                        ? 'translate-x-[20%]'
                        : 'translate-x-0'
                    } bg-white transition-all duration-300`}
                  >
                    {t('our-services')}
                  </span>
                </Link>
              </li>
              <li className='w-full px-2 text-sm'>
                <Link
                  className='relative w-full h-[48px] flex items-center gap-2 px-4'
                  href={'/contact'}
                  onClick={() => handleRedirect('/contact')}
                  onMouseOver={() => setHoverSubRoute('contact')}
                  onMouseOut={() => setHoverSubRoute(null)}
                >
                  <span className='w-6 h-[2px] bg-red-600'></span>
                  <span
                    className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                      hoverSubRoute === 'contact' || pathname === '/contact'
                        ? 'translate-x-[20%]'
                        : 'translate-x-0'
                    } bg-white transition-all duration-300`}
                  >
                    {t('contact-us')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <Link
            className={`h-full uppercase ${
              hoverRoute === 'products' || pathname === '/products'
                ? 'text-red-500'
                : ''
            } transition-colors`}
            href={'/products'}
            onClick={() => handleRedirect('/products')}
            onMouseEnter={() => setHoverRoute('products')}
            onMouseLeave={() => setHoverRoute(null)}
          >
            <p className='relative py-1'>
              <span>{t('products')}</span>
            </p>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default MenuRoutes;
