import { PopupContext } from '@/contexts/PopupProvider';
import { UserContext } from '@/contexts/UserProvider';
import { useLogoutMutation } from '@/lib/redux/query/appQuery';
import { setUser } from '@/lib/redux/slice/userSlice';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useEffect } from 'react';
import {
  IoHeartOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoExitOutline,
} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
type Props = {
  isOpenMenu: boolean;
  closeMenu: () => void;
};
function UserDropdown({ isOpenMenu, closeMenu }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { getCsrfCookie, isLoadingCSRF } = useContext(UserContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const handleRedirect = useCallback(
    (url: string) => {
      closeMenu();
      router.push(`/${url}`);
    },
    [router, closeMenu]
  );
  const [
    logout,
    {
      isLoading: isLoadingLogout,
      isSuccess: isSuccessLogout,
      isError: isErrorLogout,
      error: errorLogout,
    },
  ] = useLogoutMutation();
  const handleLogout = useCallback(async () => {
    closeMenu();
    await getCsrfCookie();
    await logout(null);
  }, [closeMenu, getCsrfCookie, logout]);
  useEffect(() => {
    if (isLoadingLogout || isLoadingCSRF) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingLogout, isLoadingCSRF, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessLogout) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Đăng xuất thành công!',
        },
      });
      dispatch(setUser(null));
    }
    if (isErrorLogout && errorLogout) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: (errorLogout as any)?.data?.message,
        },
      });
    }
  }, [isSuccessLogout, isErrorLogout, errorLogout, setVisiblePopup, dispatch]);
  return (
    <div
      className={`absolute top-[130%] right-0 bg-white border border-neutral-200 shadow ${
        isOpenMenu ? 'opacity-100 z-50' : 'opacity-0 -z-10'
      } transition-opacity duration-150`}
    >
      <div className='p-4 flex flex-col gap-4 items-start'>
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
          <p>Tài khoản</p>
        </button>
        <button
          className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
          disabled={isLoadingLogout}
          onClick={() => handleRedirect('user/settings')}
        >
          <IoSettingsOutline className='text-2xl' />
          <p>Cài đặt</p>
        </button>
        <button
          className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
          disabled={isLoadingLogout}
        >
          <IoHelpCircleOutline className='text-2xl' />
          <p>Trợ giúp</p>
        </button>
        <button
          className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
          disabled={isLoadingLogout}
          onClick={handleLogout}
        >
          <IoExitOutline className='text-2xl' />
          <p>Đăng xuất</p>
        </button>
      </div>
    </div>
  );
}

export default UserDropdown;
