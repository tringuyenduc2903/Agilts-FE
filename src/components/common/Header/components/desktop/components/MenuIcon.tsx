import useClickOutside from '@/lib/hooks/useClickOutside';
import { setUser, userInfo } from '@/lib/redux/slice/userSlice';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
} from 'react-icons/io5';
import { useLogoutMutation } from '@/lib/redux/query/userQuery';
import { ModalContext } from '@/contexts/ModalProvider';
import getCSRFCookie from '@/api/CsrfCookie';
type Props = {
  isOpenMenu: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const MenuIcon: React.FC<Props> = React.memo(
  ({ isOpenMenu, closeMenu, openMenu }) => {
    const { t } = useTranslation('header');
    const dispatch = useDispatch();
    const { setVisibleModal } = useContext(ModalContext);
    const user = useSelector(userInfo);
    const router = useRouter();
    const container = useRef<HTMLButtonElement | null>(null);
    const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
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
    useGSAP(
      () => {
        if (circlesRef.current.length > 0 && container.current && isOpenMenu) {
          gsap.fromTo(
            container.current,
            { backgroundColor: '#dc2626' },
            { backgroundColor: '#fff', duration: 0.2 }
          );
          circlesRef.current.forEach((el, index) => {
            if (el) {
              gsap.fromTo(
                el,
                { backgroundColor: '#fff' },
                { backgroundColor: '#000', delay: index * 0.01 }
              );
            }
          });
        }
        if (circlesRef.current.length > 0 && container.current && !isOpenMenu) {
          gsap.fromTo(
            container.current,
            { backgroundColor: '#fff' },
            { backgroundColor: '#dc2626', duration: 0.2 }
          );
          circlesRef.current.forEach((el, index) => {
            if (el) {
              gsap.fromTo(
                el,
                { backgroundColor: '#000' },
                { backgroundColor: '#fff', delay: index * 0.01 }
              );
            }
          });
        }
      },
      { dependencies: [isOpenMenu], scope: container }
    );

    const circles = [];
    for (let i = 0; i < 12; i++) {
      circles.push(
        <div
          key={i}
          ref={(el) => {
            circlesRef.current[i] = el;
          }}
          className='relative circles-menu-icon w-1 h-1 col-span-1 rounded-full'
        ></div>
      );
    }
    const handleLogout = useCallback(async () => {
      await getCSRFCookie();
      await logout(null);
    }, [logout]);
    useEffect(() => {
      closeMenu();
      if (isSuccessLogout) {
        setVisibleModal({
          visibleToastModal: {
            type: 'success',
            message: `${t('success_logout')}`,
          },
        });
        dispatch(setUser(null));
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
      <div className='relative'>
        <button
          disabled={isLoadingLogout}
          onClick={isOpenMenu ? closeMenu : openMenu}
          ref={container}
          className='circles-menu bg-red-500 p-6 w-full h-full grid grid-cols-4 gap-1'
        >
          {circles}
        </button>
        <div
          ref={isOpenMenu ? (sectionRef as LegacyRef<HTMLDivElement>) : null}
          className={`absolute right-0 w-[520px] ${
            isOpenMenu ? 'h-[80vh]' : 'h-0'
          } transition-[height] duration-200 bg-white overflow-hidden`}
        >
          <div className='h-full px-8 py-16 flex flex-col items-start gap-6'>
            <h1 className='text-4xl font-bold'>GRANDPRIX</h1>
            <p className='text-neutral-500'>
              Lorem ipsum dolor sit amet, qui aperiam vituperatoribus at.
              Aliquip percipit ei vix, ceteros mentitum reprehendunt eu est.
            </p>
            {user ? (
              <div className='w-full h-full font-medium flex flex-col gap-2'>
                <p className='text-4xl font-bold'>{t('welcome')}</p>
                <div>
                  <h2 className='text-2xl'>{user?.name}</h2>
                  <p>{user?.email}</p>
                </div>
                <div className='my-4 flex flex-col gap-4 items-start'>
                  <button
                    className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                    disabled={isLoadingLogout}
                  >
                    <IoPersonCircleOutline className='text-2xl' />
                    <p>{t('my_account')}</p>
                  </button>
                  <button
                    className='w-max flex items-center gap-2 hover:text-red-500 transition-colors'
                    disabled={isLoadingLogout}
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
                <button
                  className='mt-auto ml-auto bg-red-600 text-white px-8 py-2 tracking-[2px] text-lg font-bold rounded-sm'
                  // onClick={() => {
                  //   router.push('/login');
                  //   closeMenu();
                  // }}
                  onClick={handleLogout}
                  disabled={isLoadingLogout}
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                className='mt-auto ml-auto bg-red-600 text-white px-8 py-2 tracking-[2px] text-lg font-bold rounded-sm'
                disabled={isLoadingLogout}
                onClick={() => {
                  router.push('/login');
                  closeMenu();
                }}
              >
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);
MenuIcon.displayName = 'MenuIcon';
export default MenuIcon;
