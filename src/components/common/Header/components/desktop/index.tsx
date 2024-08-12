'user client';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import logo from '../.././../../../../public/logo.png';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import MenuIcon from './components/MenuIcon';
import { title } from '@/config/config';
import { subRoutesPage, subRoutesProduct } from '../../headerData';
import Cart from './components/Cart';
import { UserContext } from '@/contexts/UserProvider';
function DesktopNavigation() {
  const { locale } = useParams();
  const { cart } = useContext(UserContext);
  const t = useTranslations('header');
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
  const [hoverMenu, setHoverMenu] = useState<null | String>(null);
  const [hoverSubMenu, setHoverSubMenu] = useState<null | String>(null);
  const pathname = usePathname();
  const router = useRouter();
  const handleChangeLang = useCallback(
    (prevLang: string, curLang: string) => {
      setCookie('NEXT_LOCALE', curLang);
      setIsOpenMenu(false);
      typeof window !== 'undefined' &&
        window.location.replace(pathname.replace(prevLang, curLang));
    },
    [pathname]
  );
  return (
    <>
      <div
        className={`fixed top-0 left-0 ${
          hoverMenu || isOpenMenu
            ? 'w-full h-full z-[500] opacity-100'
            : 'w-0 h-0 -z-10 opacity-0'
        } transition-opacity duration-300`}
        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        onClick={() => setIsOpenMenu(false)}
      ></div>
      <header
        ref={headerRef}
        className='fixed bg-white text-neutral-800 w-full top-0 left-0 z-[999] px-8 flex justify-between h-[72px] items-center border-b border-neutral-200 shadow'
      >
        <div
          className={`fixed top-0 left-0 ${
            hoverMenu || isOpenMenu
              ? 'w-full h-full z-20 opacity-100'
              : 'w-0 h-0 -z-10 opacity-0'
          } transition-opacity duration-300`}
          style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
          onClick={() => setIsOpenMenu(false)}
        ></div>
        <button
          className='flex items-center overflow-hidden'
          aria-label='btn-back-home'
          onClick={() => router.push(`/${locale}`)}
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
            href={`/${locale}`}
            onMouseOver={() => setHoverMenu('home')}
            onMouseOut={() => setHoverMenu(null)}
            prefetch={true}
          >
            <p className='relative py-1'>
              <span>{t('home')}</span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                  hoverMenu === 'home' || pathname === '/' ? 'w-8' : 'w-0'
                } h-[2px] bg-red-500 transition-all duration-300`}
              ></span>
            </p>
          </Link>
          <div
            className={`relative h-full px-4 cursor-pointer ${
              hoverMenu === 'pages' ? 'bg-white' : ''
            }`}
            onMouseOver={() => setHoverMenu('pages')}
            onMouseOut={() => setHoverMenu(null)}
          >
            <button
              className={`w-full h-full uppercase flex justify-center items-center px-4 ${
                hoverMenu === 'pages' ? 'bg-white' : ''
              }`}
            >
              <p className='relative py-1'>
                <span>{t('pages')}</span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                    hoverMenu === 'pages' ||
                    subRoutesPage.includes(pathname.replace('/', ''))
                      ? 'w-8'
                      : 'w-0'
                  } h-[2px] bg-red-500 transition-all duration-300`}
                ></span>
              </p>
            </button>
            <ul
              style={{
                height:
                  hoverMenu === 'pages'
                    ? `${subRoutesPage.length * 48 + 64}px`
                    : '0px',
              }}
              className='absolute left-0 w-[240px] transition-[height] duration-300 bg-white text-neutral-500 uppercase overflow-hidden'
            >
              {subRoutesPage?.map((r, index) => {
                return (
                  <li
                    key={r}
                    className={`w-full px-4 ${index === 0 ? 'pt-8' : ''} ${
                      index === subRoutesPage.length - 1 ? 'pb-8' : ''
                    }`}
                  >
                    <Link
                      className='relative w-full h-[48px] flex items-center gap-2 px-4'
                      href={`/${locale}/${r}`}
                      onMouseOver={() => setHoverSubMenu(r)}
                      onMouseOut={() => setHoverSubMenu(null)}
                      prefetch={true}
                    >
                      <span className='w-6 h-[2px] bg-red-600'></span>
                      <span
                        className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                          hoverSubMenu === r || pathname === `/${r}`
                            ? 'translate-x-[20%]'
                            : 'translate-x-0'
                        } bg-white transition-all duration-300`}
                      >
                        {t(r)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div
            className={`relative h-full px-4 cursor-pointer ${
              hoverMenu === 'products' ? 'bg-white' : ''
            }`}
            onMouseOver={() => setHoverMenu('products')}
            onMouseOut={() => setHoverMenu(null)}
          >
            <button
              className={`w-full h-full uppercase flex justify-center items-center px-4 ${
                hoverMenu === 'products' ? 'bg-white' : ''
              }`}
            >
              <p className='relative py-1'>
                <span>{t('products')}</span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                    hoverMenu === 'products' ||
                    subRoutesProduct.includes(pathname.replace('/', ''))
                      ? 'w-8'
                      : 'w-0'
                  } h-[2px] bg-red-500 transition-all duration-300`}
                ></span>
              </p>
            </button>
            <ul
              style={{
                height:
                  hoverMenu === 'products'
                    ? `${subRoutesProduct.length * 48 + 64}px`
                    : '0px',
              }}
              className='absolute left-0 w-[240px] transition-[height] duration-300 bg-white text-neutral-500 uppercase overflow-hidden'
            >
              {subRoutesProduct?.map((r, index) => {
                return (
                  <li
                    key={r}
                    className={`w-full px-4 ${index === 0 ? 'pt-8' : ''} ${
                      index === subRoutesProduct.length - 1 ? 'pb-8' : ''
                    }`}
                  >
                    <Link
                      className='relative w-full h-[48px] flex items-center gap-2 px-4'
                      href={`/${locale}/products/${r}`}
                      onMouseOver={() => setHoverSubMenu(r)}
                      onMouseOut={() => setHoverSubMenu(null)}
                      prefetch={true}
                    >
                      <span className='w-6 h-[2px] bg-red-600'></span>
                      <span
                        className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                          hoverSubMenu === r || pathname === `/products/${r}`
                            ? 'translate-x-[20%]'
                            : 'translate-x-0'
                        } bg-white transition-all duration-300`}
                      >
                        {t(r)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div
            className={`relative h-full px-4 cursor-pointer ${
              hoverMenu === 'languages' ? 'bg-white' : ''
            }`}
            onMouseOver={() => setHoverMenu('languages')}
            onMouseOut={() => setHoverMenu(null)}
          >
            <button
              className={`w-full h-full uppercase flex justify-center items-center px-4 ${
                hoverMenu === 'languages' ? 'bg-white' : ''
              }`}
            >
              <p className='relative py-1'>
                <span>{t('languages')}</span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                    hoverMenu === 'languages' ? 'w-8' : 'w-0'
                  } h-[2px] bg-red-500 transition-all duration-300`}
                ></span>
              </p>
            </button>
            <ul
              className={`absolute left-0 w-[240px] ${
                hoverMenu === 'languages' ? 'h-[180px]' : 'h-0'
              } transition-[height] duration-300 bg-white text-neutral-500 uppercase overflow-hidden`}
            >
              <li className='w-full px-4 pt-12'>
                <button
                  className={`relative w-full h-[48px] flex items-center gap-2 px-4 uppercase ${
                    hoverSubMenu === 'english' || locale === 'en'
                      ? 'text-red-500'
                      : ''
                  } transition-colors`}
                  onMouseOver={() => setHoverSubMenu('english')}
                  onMouseOut={() => setHoverSubMenu(null)}
                  onClick={() => handleChangeLang('vi', 'en')}
                >
                  {t('english')}
                </button>
              </li>
              <li className='w-full px-4'>
                <button
                  className={`relative w-full h-[48px] flex items-center gap-2 px-4 uppercase ${
                    hoverSubMenu === 'vietnamese' || locale === 'vi'
                      ? 'text-red-500'
                      : ''
                  } transition-colors`}
                  onMouseOver={() => setHoverSubMenu('vietnamese')}
                  onMouseOut={() => setHoverSubMenu(null)}
                  onClick={() => handleChangeLang('en', 'vi')}
                >
                  {t('vietnamese')}
                </button>
              </li>
            </ul>
          </div>
        </section>
        <section className='h-full flex items-center gap-8'>
          <div
            className='relative h-full group'
            onMouseOver={() => setHoverMenu('cart')}
            onMouseOut={() => setHoverMenu(null)}
          >
            <Link
              href={`/${locale}/cart`}
              className='h-full relative z-50 flex items-center gap-2'
            >
              <span className='text-neutral-800 text-sm uppercase font-bold tracking-[2px]'>
                {t('cart')}
              </span>
              <span
                className={`p-2 size-[24px] text-[12px] flex justify-center items-center font-bold group-hover:text-white group-hover:bg-red-500 bg-neutral-300 transition-colors`}
              >
                {cart ? 1 : 0}
              </span>
            </Link>
            <div
              className={`bg-white absolute right-0 w-[420px] rounded-sm h-0 ${
                cart ? 'group-hover:h-[40vh]' : 'group-hover:h-[6vh]'
              } transition-[height] duration-150 overflow-y-auto`}
            >
              {cart ? (
                <Cart />
              ) : (
                <p className='w-full h-full flex justify-center items-center font-bold uppercase'>
                  {t('no_product_in_cart')}
                </p>
              )}
            </div>
          </div>
          <div className='rounded-sm relative z-50'>
            <MenuIcon
              isOpenMenu={isOpenMenu}
              openMenu={() => setIsOpenMenu(true)}
              closeMenu={() => setIsOpenMenu(false)}
            />
          </div>
        </section>
      </header>
    </>
  );
}

export default DesktopNavigation;
