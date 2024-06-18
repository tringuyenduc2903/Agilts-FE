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
import { ModalContext } from '@/contexts/ModalProvider';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '@/lib/redux/slice/userSlice';
import { getCookies, setCookie } from 'cookies-next';
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
  const { setVisibleModal } = useContext(ModalContext);
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
      const curLang = getCookies().NEXT_LOCALE || 'vi';
      router.push(`/${curLang}/${url}`);
      closeMenu();
    },
    [router, closeMenu, getCookies]
  );
  const handleChangeLang = useCallback(
    (lang: string) => {
      setCookie('NEXT_LOCALE', lang);
      router.replace(`/${lang}`);
      closeMenu();
    },
    [closeMenu, router, setCookie]
  );
  const handleLogout = useCallback(async () => {
    await handleGetCSRFCookie();
    await logout(null);
  }, [logout, handleGetCSRFCookie]);
  useEffect(() => {
    closeMenu();
    if (isSuccessLogout) {
      setVisibleModal({
        visibleToastModal: {
          type: 'success',
          message: `${t('success_logout')}`,
        },
      });
      dispatch(setIsLoggedIn(false));
    }
    if (isErrorLogout && errorLogout) {
      const error = errorLogout as any;
      setVisibleModal({
        visibleToastModal: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessLogout,
    isErrorLogout,
    errorLogout,
    setVisibleModal,
    t,
    dispatch,
  ]);
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
            href={'/'}
            onClick={() => handleRedirect('')}
            onMouseEnter={() => setHoverRoute('home')}
            onMouseLeave={() => setHoverRoute(null)}
            aria-disabled={isLoadingLogout || isLoadingCSRF}
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
              className={` ${
                subRoute === 'pages' ? 'h-[144px]' : 'h-0'
              } transition-[height] duration-200 bg-white text-neutral-500 uppercase overflow-hidden`}
            >
              <li className='w-full px-2 text-sm'>
                <Link
                  className='relative w-full h-[48px] flex items-center gap-2 px-4'
                  href={'/about-us'}
                  onClick={() => handleRedirect('about-us')}
                  onMouseOver={() => setHoverSubRoute('about-us')}
                  onMouseOut={() => setHoverSubRoute(null)}
                  aria-disabled={isLoadingLogout || isLoadingCSRF}
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
                  onClick={() => handleRedirect('our-services')}
                  onMouseOver={() => setHoverSubRoute('our-services')}
                  onMouseOut={() => setHoverSubRoute(null)}
                  aria-disabled={isLoadingLogout || isLoadingCSRF}
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
                  aria-disabled={isLoadingLogout || isLoadingCSRF}
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
            aria-disabled={isLoadingLogout || isLoadingCSRF}
          >
            <p className='relative py-1'>
              <span>{t('products')}</span>
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
                  onClick={() => handleChangeLang('en')}
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
                  onClick={() => handleChangeLang('vi')}
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
