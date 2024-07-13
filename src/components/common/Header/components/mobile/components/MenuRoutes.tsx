'use client';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { useLogoutMutation } from '@/lib/redux/query/userQuery';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { FaXmark, FaAngleRight } from 'react-icons/fa6';
import {
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
} from 'react-icons/io5';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '@/lib/redux/slice/userSlice';
import { setCookie } from 'cookies-next';
import { subRoutes } from '../../../headerData';
import { PopupContext } from '@/contexts/PopupProvider';
type Props = {
  isOpenMenu: boolean;
  closeMenu: () => void;
};
const MenuRoutes: React.FC<Props> = React.memo(({ isOpenMenu, closeMenu }) => {
  const { locale } = useParams();
  const { user, handleGetCSRFCookie, isLoadingCSRF } =
    useContext(FetchDataContext);
  const t = useTranslations('header');
  const dispatch = useDispatch();
  const { setVisiblePopup } = useContext(PopupContext);
  const router = useRouter();
  const pathname = usePathname();
  const [hoverRoute, setHoverRoute] = useState<null | String>(null);
  const [subRoute, setSubRoute] = useState<null | String>(null);
  const [hoverSubRoute, setHoverSubRoute] = useState<null | String>(null);
  const { sectionRef } = useClickOutside(closeMenu);
  const [
    logout,
    {
      isSuccess: isSuccessLogout,
      isLoading: isLoadingLogout,
      isError: isErrorLogout,
      error: errorLogout,
    },
  ] = useLogoutMutation();
  const handleRedirect = useCallback(
    (url: string) => {
      router.push(`/${locale}/${url}`);
      closeMenu();
    },
    [router, closeMenu, locale]
  );
  const handleChangeLang = useCallback(
    (prevLang: string, curLang: string) => {
      setCookie('NEXT_LOCALE', curLang);
      closeMenu();
      typeof window !== 'undefined' &&
        window.location.replace(pathname.replace(prevLang, curLang));
    },
    [closeMenu, pathname]
  );
  const handleLogout = useCallback(async () => {
    await handleGetCSRFCookie();
    await logout(null);
  }, [logout, handleGetCSRFCookie]);
  useEffect(() => {
    closeMenu();
    if (isSuccessLogout) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('success_logout')}`,
        },
      });
      dispatch(setIsLoggedIn(false));
      router.replace(`/${locale}`);
    }
    if (isErrorLogout && errorLogout) {
      const error = errorLogout as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessLogout,
    isErrorLogout,
    errorLogout,
    setVisiblePopup,
    t,
    dispatch,
    router,
    locale,
  ]);
  return (
    <aside
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className={`fixed top-0 left-0 h-full w-full z-[100] ${
        isOpenMenu ? 'translate-x-0' : '-translate-x-[100%]'
      } transition-transform duration-200 overflow-y-auto`}
      // onClick={closeMenu}
    >
      <div
        ref={isOpenMenu ? (sectionRef as LegacyRef<HTMLDivElement>) : null}
        className='sm:w-2/3 md:w-1/2 h-full bg-white p-4 flex flex-col gap-6'
        aria-disabled={isLoadingLogout || isLoadingCSRF}
      >
        <div className='pb-4 border-b border-neutral-300 flex justify-between'>
          {user ? (
            <div className='w-full h-full font-medium flex flex-col gap-2'>
              <p className='text-2xl font-bold'>{t('welcome')}</p>
              <div>
                <h2 className='text-xl'>{user?.name}</h2>
                <p className='text-sm'>{user?.email}</p>
              </div>
              <div className='my-4 flex flex-col gap-4 items-start'>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingLogout || isLoadingCSRF}
                  onClick={() => handleRedirect('user/account')}
                >
                  <IoPersonCircleOutline className='text-2xl' />
                  <p>{t('my_account')}</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingLogout || isLoadingCSRF}
                  onClick={() => handleRedirect('user/settings')}
                >
                  <IoSettingsOutline className='text-2xl' />
                  <p>{t('settings')}</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingLogout || isLoadingCSRF}
                >
                  <IoHelpCircleOutline className='text-2xl' />
                  <p>{t('help')}</p>
                </button>
              </div>
            </div>
          ) : (
            <button
              className='bg-red-600 text-white px-8 py-2 tracking-[2px] text-base font-bold rounded-sm'
              onClick={() => handleRedirect('login')}
            >
              {t('login')}
            </button>
          )}
          <button
            className='w-max h-max'
            aria-label='close-menu-routes'
            onClick={closeMenu}
            disabled={isLoadingLogout || isLoadingCSRF}
          >
            <FaXmark className='text-2xl' />
          </button>
        </div>
        <div className='font-medium flex flex-col gap-4'>
          <Link
            className={`h-full uppercase ${
              hoverRoute === 'home' || pathname === '/' ? 'text-red-500' : ''
            } transition-colors`}
            href={`/${locale}`}
            onClick={() => handleRedirect('')}
            onMouseEnter={() => setHoverRoute('home')}
            onMouseLeave={() => setHoverRoute(null)}
            aria-disabled={isLoadingLogout || isLoadingCSRF}
            prefetch={true}
          >
            <p className='relative py-1'>
              <span>{t('home')}</span>
            </p>
          </Link>
          <div
            className={`cursor-pointer ${
              hoverRoute === 'pages' ||
              subRoutes.includes(pathname.replace('/', ''))
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
            aria-disabled={isLoadingLogout || isLoadingCSRF}
          >
            <button className='w-full uppercase flex justify-between items-center gap-8'>
              <p>{t('pages')}</p>
              <FaAngleRight
                className={`${
                  subRoute === 'pages' ? 'rotate-90' : 'rotate-0'
                } transition-all duration-100 text-sm`}
              />
            </button>
            <ul
              style={{
                height:
                  subRoute === 'pages' ? `${subRoutes.length * 48}px` : '0px',
              }}
              className='transition-[height] duration-200 bg-white text-neutral-500 uppercase overflow-hidden'
            >
              {subRoutes.map((r) => {
                return (
                  <li key={r} className='w-full px-2 text-sm'>
                    <Link
                      className='relative w-full h-[48px] flex items-center gap-2 px-4'
                      href={`/${locale}/${r}`}
                      onClick={() => handleRedirect(r)}
                      onMouseOver={() => setHoverSubRoute(r)}
                      onMouseOut={() => setHoverSubRoute(null)}
                      aria-disabled={isLoadingLogout || isLoadingCSRF}
                      prefetch={true}
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
            className={`h-full uppercase ${
              hoverRoute === 'products' || pathname === '/products'
                ? 'text-red-500'
                : ''
            } transition-colors`}
            href={`/${locale}/products`}
            onClick={() => handleRedirect('/products')}
            onMouseEnter={() => setHoverRoute('products')}
            onMouseLeave={() => setHoverRoute(null)}
            aria-disabled={isLoadingLogout || isLoadingCSRF}
            prefetch={true}
          >
            <p className='relative py-1'>
              <span>{t('products')}</span>
            </p>
          </Link>
          <Link
            className={`h-full uppercase ${
              hoverRoute === 'search' || pathname === '/search'
                ? 'text-red-500'
                : ''
            } transition-colors`}
            href={`/${locale}/search`}
            onClick={() => handleRedirect('/search')}
            onMouseEnter={() => setHoverRoute('search')}
            onMouseLeave={() => setHoverRoute(null)}
            aria-disabled={isLoadingLogout || isLoadingCSRF}
            prefetch={true}
          >
            <p className='relative py-1'>
              <span>{t('search')}</span>
            </p>
          </Link>
          <Link
            className={`h-full uppercase ${
              hoverRoute === 'cart' || pathname === '/cart'
                ? 'text-red-500'
                : ''
            } transition-colors`}
            href={`/${locale}/cart`}
            onClick={() => handleRedirect('/cart')}
            onMouseEnter={() => setHoverRoute('cart')}
            onMouseLeave={() => setHoverRoute(null)}
            aria-disabled={isLoadingLogout || isLoadingCSRF}
            prefetch={true}
          >
            <p className='relative py-1'>
              <span>{t('cart')}</span>
            </p>
          </Link>
          <div>
            <button
              className={`w-full uppercase flex justify-between items-center gap-8 ${
                subRoute === 'languages' ? 'text-red-500' : ''
              } transition-colors`}
              onClick={() =>
                setSubRoute((prevState) => {
                  if (prevState === 'languages') return null;
                  return 'languages';
                })
              }
              onMouseEnter={() => setHoverRoute('languages')}
              onMouseLeave={() => setHoverRoute(null)}
              disabled={isLoadingLogout || isLoadingCSRF}
            >
              <p>{t('languages')}</p>
              <FaAngleRight
                className={`${
                  subRoute === 'languages' ? 'rotate-90' : 'rotate-0'
                } transition-all duration-100 text-sm`}
              />
            </button>
            <ul
              className={` ${
                subRoute === 'languages' ? 'h-[90px]' : 'h-0'
              } transition-[height] duration-200 bg-white text-neutral-500 overflow-hidden`}
            >
              <li className='w-full px-2 text-sm'>
                <button
                  className={`relative w-full h-[48px] flex items-center gap-2 px-4 uppercase ${
                    hoverSubRoute === 'english' || locale === 'en'
                      ? 'text-red-500'
                      : ''
                  } transition-colors`}
                  onClick={() => handleChangeLang('vi', 'en')}
                  onMouseOver={() => setHoverSubRoute('english')}
                  onMouseOut={() => setHoverSubRoute(null)}
                  disabled={isLoadingLogout || isLoadingCSRF}
                >
                  {t('english')}
                </button>
              </li>
              <li className='w-full px-2 text-sm'>
                <button
                  className={`relative w-full h-[48px] flex items-center gap-2 px-4 uppercase ${
                    hoverSubRoute === 'vietnamese' || locale === 'vi'
                      ? 'text-red-500'
                      : ''
                  } transition-colors`}
                  onClick={() => handleChangeLang('en', 'vi')}
                  onMouseOver={() => setHoverSubRoute('vietnamese')}
                  onMouseOut={() => setHoverSubRoute(null)}
                  disabled={isLoadingLogout || isLoadingCSRF}
                >
                  {t('vietnamese')}
                </button>
              </li>
            </ul>
          </div>
        </div>
        {user && (
          <button
            className='mt-auto ml-auto bg-red-600 text-white px-8 py-2 tracking-[2px] text-lg font-bold rounded-sm'
            onClick={handleLogout}
            disabled={isLoadingLogout || isLoadingCSRF}
          >
            {t('logout')}
          </button>
        )}
      </div>
    </aside>
  );
});
MenuRoutes.displayName = 'MenuRoutes';
export default MenuRoutes;
