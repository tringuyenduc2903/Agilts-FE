'use client';
import useClickOutside from '@/lib/hooks/useClickOutside';
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
  IoHeartOutline,
} from 'react-icons/io5';
import { UserContext } from '@/contexts/UserProvider';
import { useDispatch } from 'react-redux';
import { setCurMotorbike, setUser } from '@/lib/redux/slice/userSlice';
import { deleteCookie, setCookie } from 'cookies-next';
import { PopupContext } from '@/contexts/PopupProvider';
import { useFetch } from '@/lib/hooks/useFetch';
import { logout } from '@/api/user';
import { subRoutesPage, subRoutesProduct } from '../../../headerData';
type Props = {
  isOpenMenu: boolean;
  closeMenu: () => void;
};
const MenuRoutes: React.FC<Props> = React.memo(({ isOpenMenu, closeMenu }) => {
  const { locale } = useParams();
  const { user, setCart } = useContext(UserContext);
  const t = useTranslations('header');
  const dispatch = useDispatch();
  const { setVisiblePopup } = useContext(PopupContext);
  const router = useRouter();
  const pathname = usePathname();
  const [hoverRoute, setHoverRoute] = useState<null | String>(null);
  const [subRoute, setSubRoute] = useState<null | String>(null);
  const [hoverSubRoute, setHoverSubRoute] = useState<null | String>(null);
  const { sectionRef } = useClickOutside(closeMenu);
  const {
    fetchData: logoutMutation,
    isSuccess: isSuccessLogout,
    isLoading: isLoadingLogout,
    isError: isErrorLogout,
    error: errorLogout,
  } = useFetch(async () => await logout());
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
    await logoutMutation();
  }, [logoutMutation]);
  useEffect(() => {
    closeMenu();
    if (isSuccessLogout) {
      closeMenu();
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: `${t('success_logout')}`,
        },
      });
      dispatch(setUser(null));
      dispatch(setCurMotorbike(null));
      setCart([]);
      deleteCookie('buy_now');
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
    deleteCookie,
  ]);
  return (
    <aside
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className={`fixed top-0 left-0 h-full w-full z-[9999] ${
        isOpenMenu ? 'translate-x-0' : '-translate-x-[100%]'
      } transition-transform duration-200 overflow-y-auto`}
      // onClick={closeMenu}
    >
      <div
        ref={isOpenMenu ? (sectionRef as LegacyRef<HTMLDivElement>) : null}
        className='sm:w-2/3 md:w-1/2 h-full bg-white p-4 flex flex-col gap-6'
        aria-disabled={isLoadingLogout}
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
                  disabled={isLoadingLogout}
                  onClick={() => handleRedirect('wishlist')}
                >
                  <IoHeartOutline className='text-2xl' />
                  <p>{t('wishlist')}</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingLogout}
                  onClick={() => handleRedirect('user/account')}
                >
                  <IoPersonCircleOutline className='text-2xl' />
                  <p>{t('my_account')}</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingLogout}
                  onClick={() => handleRedirect('user/settings')}
                >
                  <IoSettingsOutline className='text-2xl' />
                  <p>{t('settings')}</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingLogout}
                >
                  <IoHelpCircleOutline className='text-2xl' />
                  <p>{t('help')}</p>
                </button>
              </div>
            </div>
          ) : (
            <div className='flex items-center gap-4'>
              <button
                className='w-max border border-red-600 bg-red-600 text-white px-8 py-2 tracking-[2px] text-lg font-bold rounded-sm'
                disabled={isLoadingLogout}
                onClick={() => handleRedirect('login')}
              >
                {t('login')}
              </button>
              <button
                className='w-max border border-neutral-500 px-8 py-2 tracking-[2px] text-lg font-bold rounded-sm'
                disabled={isLoadingLogout}
                onClick={() => handleRedirect('register')}
              >
                {t('register')}
              </button>
            </div>
          )}
          <button
            className='w-max h-max'
            aria-label='close-menu-routes'
            onClick={closeMenu}
            disabled={isLoadingLogout}
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
            aria-disabled={isLoadingLogout}
            prefetch={true}
          >
            <p className='relative py-1'>
              <span>{t('home')}</span>
            </p>
          </Link>
          <div
            className={`cursor-pointer ${
              hoverRoute === 'pages' ||
              subRoutesPage.includes(pathname.replace('/', ''))
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
            aria-disabled={isLoadingLogout}
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
                  subRoute === 'pages'
                    ? `${subRoutesPage.length * 48}px`
                    : '0px',
              }}
              className='transition-[height] duration-200 bg-white text-neutral-500 uppercase overflow-hidden'
            >
              {subRoutesPage.map((r) => {
                return (
                  <li key={r} className='w-full px-2 text-sm'>
                    <Link
                      className='relative w-full h-[48px] flex items-center gap-2 px-4'
                      href={`/${locale}/${r}`}
                      onClick={() => handleRedirect(r)}
                      onMouseOver={() => setHoverSubRoute(r)}
                      onMouseOut={() => setHoverSubRoute(null)}
                      aria-disabled={isLoadingLogout}
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
          <div
            className={`cursor-pointer ${
              hoverRoute === 'products' || pathname.includes('products')
                ? 'text-red-500'
                : ''
            } transition-colors`}
            onClick={() =>
              setSubRoute((prevState) => {
                if (prevState === 'products') return null;
                return 'products';
              })
            }
            onMouseEnter={() => setHoverRoute('products')}
            onMouseLeave={() => setHoverRoute(null)}
            aria-disabled={isLoadingLogout}
          >
            <button className='w-full uppercase flex justify-between items-center gap-8'>
              <p>{t('products')}</p>
              <FaAngleRight
                className={`${
                  subRoute === 'products' ? 'rotate-90' : 'rotate-0'
                } transition-all duration-100 text-sm`}
              />
            </button>
            <ul
              style={{
                height:
                  subRoute === 'products'
                    ? `${subRoutesProduct.length * 48}px`
                    : '0px',
              }}
              className='transition-[height] duration-200 bg-white text-neutral-500 uppercase overflow-hidden'
            >
              {subRoutesProduct.map((r) => {
                return (
                  <li key={r} className='w-full px-2 text-sm'>
                    <Link
                      className='relative w-full h-[48px] flex items-center gap-2 px-4'
                      href={`/${locale}/products/${r}`}
                      onClick={() => handleRedirect(r)}
                      onMouseOver={() => setHoverSubRoute(r)}
                      onMouseOut={() => setHoverSubRoute(null)}
                      aria-disabled={isLoadingLogout}
                      prefetch={true}
                    >
                      <span className='w-6 h-[2px] bg-red-600'></span>
                      <span
                        className={`absolute w-[180px] px-4 left-0 top-1/2 -translate-y-1/2 ${
                          hoverSubRoute === r || pathname === `/products/${r}`
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
              hoverRoute === 'cart' || pathname === '/cart'
                ? 'text-red-500'
                : ''
            } transition-colors`}
            href={`/${locale}/cart`}
            onClick={() => handleRedirect('/cart')}
            onMouseEnter={() => setHoverRoute('cart')}
            onMouseLeave={() => setHoverRoute(null)}
            aria-disabled={isLoadingLogout}
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
              disabled={isLoadingLogout}
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
                  disabled={isLoadingLogout}
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
                  disabled={isLoadingLogout}
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
            disabled={isLoadingLogout}
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
