'use client';
import useClickOutside from '@/lib/hooks/useClickOutside';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { LegacyRef, useCallback, useContext, useEffect } from 'react';
import { FaXmark } from 'react-icons/fa6';
import {
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoHeartOutline,
} from 'react-icons/io5';
import { UserContext } from '@/contexts/UserProvider';
import { useDispatch } from 'react-redux';
import { setCurMotorbike, setUser } from '@/lib/redux/slice/userSlice';
import { deleteCookie } from 'cookies-next';
import { PopupContext } from '@/contexts/PopupProvider';
import { useLogoutMutation } from '@/lib/redux/query/appQuery';
type Props = {
  isOpenMenu: boolean;
  closeMenu: () => void;
};
const MenuRoutes: React.FC<Props> = React.memo(({ isOpenMenu, closeMenu }) => {
  const { user, getCsrfCookie, isLoadingCSRF } = useContext(UserContext);
  const dispatch = useDispatch();
  const { setVisiblePopup } = useContext(PopupContext);
  const router = useRouter();
  const pathname = usePathname();
  const sectionRef = useClickOutside(closeMenu);
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
      router.push(`/${url}`);
      closeMenu();
    },
    [router, closeMenu]
  );
  const handleLogout = useCallback(async () => {
    await getCsrfCookie();
    await logout(null);
  }, [getCsrfCookie, logout]);
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
      deleteCookie('buy_now');
      router.replace(`/`);
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
    >
      <div
        ref={isOpenMenu ? (sectionRef as LegacyRef<HTMLDivElement>) : null}
        className='sm:w-2/3 md:w-1/2 h-full bg-white p-4 flex flex-col gap-6'
      >
        <div className='pb-4 border-b border-neutral-300 flex justify-between'>
          {user ? (
            <div className='w-full h-full font-medium flex flex-col gap-2'>
              <p className='text-2xl font-bold'>Chào mừng</p>
              <div>
                <h2 className='text-xl'>{user?.name}</h2>
                <p className='text-sm'>{user?.email}</p>
              </div>
              <div className='my-4 flex flex-col gap-4 items-start'>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingCSRF || isLoadingLogout}
                  onClick={() => handleRedirect('wishlist')}
                >
                  <IoHeartOutline className='text-2xl' />
                  <p>Danh sách mong muốn</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingCSRF || isLoadingLogout}
                  onClick={() => handleRedirect('user/account')}
                >
                  <IoPersonCircleOutline className='text-2xl' />
                  <p>Tài khoản</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingCSRF || isLoadingLogout}
                  onClick={() => handleRedirect('user/settings')}
                >
                  <IoSettingsOutline className='text-2xl' />
                  <p>Cài đặt</p>
                </button>
                <button
                  className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                  disabled={isLoadingCSRF || isLoadingLogout}
                >
                  <IoHelpCircleOutline className='text-2xl' />
                  <p>Trợ giúp</p>
                </button>
              </div>
            </div>
          ) : (
            <button
              className='w-max border border-red-600 bg-red-600 text-white px-4 py-1 text-base md:text-lg tracking-[2px] font-bold rounded-sm'
              disabled={isLoadingLogout}
              onClick={() => handleRedirect('login')}
            >
              Đăng ký / Đăng nhập
            </button>
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
        <div className='flex flex-col gap-4'>
          <Link
            className={`uppercase text-lg font-semibold hover:text-red-500 transition-colors ${
              pathname === '/' ? 'text-red-500' : ''
            }`}
            href='/'
            onClick={closeMenu}
          >
            Trang chủ
          </Link>
          <Link
            className={`uppercase text-lg font-semibold hover:text-red-500 transition-colors ${
              pathname.includes('motor-cycle') ? 'text-red-500' : ''
            }`}
            href='/products/motor-cycle'
            onClick={closeMenu}
          >
            Xe máy
          </Link>
          <Link
            className={`uppercase text-lg font-semibold hover:text-red-500 transition-colors ${
              pathname.includes('square-parts') ? 'text-red-500' : ''
            }`}
            href='/products/square-parts'
            onClick={closeMenu}
          >
            Phụ tùng
          </Link>
          <Link
            className={`uppercase text-lg font-semibold hover:text-red-500 transition-colors ${
              pathname.includes('accessories') ? 'text-red-500' : ''
            }`}
            href='/products/accessories'
            onClick={closeMenu}
          >
            Phụ kiện
          </Link>
          <Link
            className={`uppercase text-lg font-semibold hover:text-red-500 transition-colors ${
              pathname.includes('/contact') ? 'text-red-500' : ''
            }`}
            href='/contact'
            onClick={closeMenu}
          >
            Liên hệ chúng tôi
          </Link>
        </div>
        {user && (
          <button
            className='mt-auto ml-auto bg-red-600 text-white px-8 py-2 tracking-[2px] text-base md:text-lg font-bold rounded-sm'
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
