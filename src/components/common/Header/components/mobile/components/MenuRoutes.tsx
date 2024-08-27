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
  const { user, setCart } = useContext(UserContext);
  const dispatch = useDispatch();
  const { setVisiblePopup } = useContext(PopupContext);
  const router = useRouter();
  const pathname = usePathname();
  const [hoverRoute, setHoverRoute] = useState<null | String>(null);
  const [subRoute, setSubRoute] = useState<null | String>(null);
  const [hoverSubRoute, setHoverSubRoute] = useState<null | String>(null);
  const sectionRef = useClickOutside(closeMenu);
  const {
    fetchData: logoutMutation,
    isSuccess: isSuccessLogout,
    isLoading: isLoadingLogout,
    isError: isErrorLogout,
    error: errorLogout,
  } = useFetch(async () => await logout());
  const handleRedirect = useCallback(
    (url: string) => {
      router.push(`/${url}`);
      closeMenu();
    },
    [router, closeMenu]
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
          message: `Đăng xuất thành công!`,
        },
      });
      dispatch(setUser(null));
      dispatch(setCurMotorbike(null));
      setCart([]);
      deleteCookie('buy_now');
      router.replace(``);
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
    dispatch,
    router,
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
        {/* <div className='pb-4 border-b border-neutral-300 flex justify-between'>
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
                  <p>Danh sách mong muốn</p>
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
                Đăng nhập
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
        </div> */}
        {user && (
          <button
            className='mt-auto ml-auto bg-red-600 text-white px-8 py-2 tracking-[2px] text-lg font-bold rounded-sm'
            onClick={handleLogout}
            disabled={isLoadingLogout}
          >
            Đăng xuất
          </button>
        )}
      </div>
    </aside>
  );
});
MenuRoutes.displayName = 'MenuRoutes';
export default MenuRoutes;
