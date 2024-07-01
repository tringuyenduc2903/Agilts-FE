'user client';
import React, { useCallback, useRef, useState } from 'react';
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
import { subRoutes } from '../../hearderData';
function DesktopNavigation() {
  const { locale } = useParams();
  const t = useTranslations('header');
  const headerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
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
  const [hoverRoute, setHoverRoute] = useState<null | String>(null);
  const [hoverSubRoute, setHoverSubRoute] = useState<null | String>(null);
  const [hoverCart, setHoverCart] = useState(false);
  const [isFocusInput, setIsFocusInput] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const handleChangeLang = useCallback(
    (lang: string) => {
      setCookie('NEXT_LOCALE', lang);
      router.replace(`/${lang}`);
      setIsOpenMenu(false);
    },
    [router, setCookie]
  );
  return (
    <>
      <div
        className={`fixed top-0 left-0 ${
          hoverRoute || isOpenMenu
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
            hoverRoute || isOpenMenu || hoverCart
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
            />
          </div>
          <p className='text-4xl font-bold uppercase'>
            {title?.replace('A', '')}
          </p>
        </button>
        <section className='relative z-[999] h-full flex items-center font-bold tracking-[1px]'>
          <Link
            className={`h-full uppercase flex justify-center items-center px-4 ${
              hoverRoute === 'home' ? 'bg-white' : ''
            }`}
            href={`/${locale}`}
            onMouseEnter={() => setHoverRoute('home')}
            onMouseLeave={() => setHoverRoute(null)}
          >
            <p className='relative py-1'>
              <span>{t('home')}</span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                  hoverRoute === 'home' || pathname === '/' ? 'w-8' : 'w-0'
                } h-[2px] bg-red-500 transition-all duration-300`}
              ></span>
            </p>
          </Link>
          <div
            className={`relative h-full px-4 cursor-pointer ${
              hoverRoute === 'pages' ? 'bg-white' : ''
            }`}
            onMouseEnter={() => setHoverRoute('pages')}
            onMouseLeave={() => setHoverRoute(null)}
          >
            <button
              className={`w-full h-full uppercase flex justify-center items-center px-4 ${
                hoverRoute === 'pages' ? 'bg-white' : ''
              }`}
            >
              <p className='relative py-1'>
                <span>{t('pages')}</span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                    hoverRoute === 'pages' ||
                    subRoutes.includes(pathname.replace('/', ''))
                      ? 'w-8'
                      : 'w-0'
                  } h-[2px] bg-red-500 transition-all duration-300`}
                ></span>
              </p>
            </button>
            <ul
              style={{
                height:
                  hoverRoute === 'pages'
                    ? `${subRoutes.length * 48 + 64}px`
                    : '0px',
              }}
              className='absolute left-0 w-[240px] transition-[height] duration-300 bg-white text-neutral-500 uppercase overflow-hidden'
            >
              {subRoutes?.map((r, index) => {
                return (
                  <li
                    key={r}
                    className={`w-full px-4 ${index === 0 ? 'pt-8' : ''} ${
                      index === subRoutes.length - 1 ? 'pb-8' : ''
                    }`}
                  >
                    <Link
                      className='relative w-full h-[48px] flex items-center gap-2 px-4'
                      href={`/${locale}/${r}`}
                      onMouseOver={() => setHoverSubRoute(r)}
                      onMouseOut={() => setHoverSubRoute(null)}
                    >
                      <span className='w-6 h-[2px] bg-red-600'></span>
                      <span
                        className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                          hoverSubRoute === r || pathname === `/${r}`
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
          <Link
            className={`h-full uppercase flex justify-center items-center px-4 ${
              hoverRoute === 'products' ? 'bg-white' : ''
            }`}
            href={`/${locale}/products`}
            onMouseEnter={() => setHoverRoute('products')}
            onMouseLeave={() => setHoverRoute(null)}
          >
            <p className='relative py-1'>
              <span>{t('products')}</span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                  hoverRoute === 'products' || pathname === '/products'
                    ? 'w-8'
                    : 'w-0'
                } h-[2px] bg-red-500 transition-all duration-300`}
              ></span>
            </p>
          </Link>
          <div
            className={`relative h-full px-4 cursor-pointer ${
              hoverRoute === 'languages' ? 'bg-white' : ''
            }`}
            onMouseEnter={() => setHoverRoute('languages')}
            onMouseLeave={() => setHoverRoute(null)}
          >
            <button
              className={`w-full h-full uppercase flex justify-center items-center px-4 ${
                hoverRoute === 'languages' ? 'bg-white' : ''
              }`}
            >
              <p className='relative py-1'>
                <span>{t('languages')}</span>
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                    hoverRoute === 'languages' ? 'w-8' : 'w-0'
                  } h-[2px] bg-red-500 transition-all duration-300`}
                ></span>
              </p>
            </button>
            <ul
              className={`absolute left-0 w-[240px] ${
                hoverRoute === 'languages' ? 'h-[180px]' : 'h-0'
              } transition-[height] duration-300 bg-white text-neutral-500 uppercase overflow-hidden`}
            >
              <li className='w-full px-4 pt-12'>
                <button
                  className={`relative w-full h-[48px] flex items-center gap-2 px-4 uppercase ${
                    hoverSubRoute === 'english' || locale === 'en'
                      ? 'text-red-500'
                      : ''
                  } transition-colors`}
                  onMouseOver={() => setHoverSubRoute('english')}
                  onMouseOut={() => setHoverSubRoute(null)}
                  onClick={() => handleChangeLang('en')}
                >
                  {t('english')}
                </button>
              </li>
              <li className='w-full px-4'>
                <button
                  className={`relative w-full h-[48px] flex items-center gap-2 px-4 uppercase ${
                    hoverSubRoute === 'vietnamese' || locale === 'vi'
                      ? 'text-red-500'
                      : ''
                  } transition-colors`}
                  onMouseOver={() => setHoverSubRoute('vietnamese')}
                  onMouseOut={() => setHoverSubRoute(null)}
                  onClick={() => handleChangeLang('vi')}
                >
                  {t('vietnamese')}
                </button>
              </li>
            </ul>
          </div>
        </section>
        <section className='flex items-center gap-8'>
          <div className='relative w-[220px]'>
            <input
              className='w-full placeholder:text-neutral-800 text-neutral-800 focus:outline-none font-bold bg-transparent uppercase'
              type='text'
              placeholder={t('search')}
              // dir='rtl'
              ref={inputRef}
              onFocus={() => setIsFocusInput(true)}
              onBlur={() => setIsFocusInput(false)}
            />
            <span className='absolute -bottom-2 left-0 w-full h-[2px] bg-neutral-300'></span>
            <span
              className={`absolute -bottom-2 left-0 h-[2px] w-full bg-red-500 z-10 ${
                isFocusInput ? 'opacity-100' : 'opacity-0'
              } transition-all duration-300`}
            ></span>
          </div>
          <button
            className='relative z-50 flex items-center gap-2'
            onMouseOver={() => setHoverCart(true)}
            onMouseOut={() => setHoverCart(false)}
          >
            <span className='text-neutral-800 text-sm uppercase font-bold tracking-[2px]'>
              {t('cart')}
            </span>
            <span
              className={`p-2 size-[24px] text-[12px] flex justify-center items-center font-bold ${
                hoverCart ? 'text-white bg-red-500' : 'bg-neutral-300'
              } transition-colors`}
            >
              0
            </span>
          </button>
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
