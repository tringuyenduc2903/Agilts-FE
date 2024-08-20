import useClickOutside from '@/lib/hooks/useClickOutside';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useParams, useRouter } from 'next/navigation';
import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useTranslations } from 'next-intl';
import {
  IoHeartOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
} from 'react-icons/io5';
import { UserContext } from '@/contexts/UserProvider';
import { useDispatch } from 'react-redux';
import { setCurMotorbike, setUser } from '@/lib/redux/slice/userSlice';
import { title } from '@/config/config';
import { PopupContext } from '@/contexts/PopupProvider';
import { useFetch } from '@/lib/hooks/useFetch';
import { logout } from '@/api/user';
import { deleteCookie } from 'cookies-next';
type Props = {
  isOpenMenu: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const MenuIcon: React.FC<Props> = React.memo(
  ({ isOpenMenu, closeMenu, openMenu }) => {
    const { locale } = useParams();
    const t = useTranslations('header');
    const dispatch = useDispatch();
    const { setVisiblePopup } = useContext(PopupContext);
    const { user, setCart } = useContext(UserContext);
    const router = useRouter();
    const container = useRef<HTMLButtonElement | null>(null);
    const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
    const { sectionRef, clickOutside } = useClickOutside(closeMenu);
    const {
      fetchData: logoutMutation,
      isSuccess: isSuccessLogout,
      isLoading: isLoadingLogout,
      isError: isErrorLogout,
      error: errorLogout,
    } = useFetch(async () => await logout());
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
    const handleRedirect = useCallback(
      (url: string) => {
        router.push(`/${locale}/${url}`);
        closeMenu();
      },
      [router, closeMenu, locale]
    );
    const handleLogout = useCallback(async () => {
      await logoutMutation();
    }, [logoutMutation]);
    useEffect(() => {
      if (isSuccessLogout) {
        closeMenu();
        dispatch(setUser(null));
        dispatch(setCurMotorbike(null));
        setCart([]);
        deleteCookie('buy_now');
        setVisiblePopup({
          visibleToastPopup: {
            type: 'success',
            message: `${t('success_logout')}`,
          },
        });
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
      <div className='relative'>
        {!isOpenMenu && (
          <button
            disabled={isLoadingLogout}
            onClick={openMenu}
            ref={container}
            className='relative circles-menu bg-red-500 p-6 w-full h-full grid grid-cols-4 gap-1'
            aria-label='menu-btn'
          >
            {circles}
          </button>
        )}
        {isOpenMenu && (
          <button
            disabled={isLoadingLogout}
            onClick={() => clickOutside}
            ref={container}
            className='relative circles-menu bg-red-500 p-6 w-full h-full grid grid-cols-4 gap-1'
            aria-label='menu-btn'
          >
            {circles}
          </button>
        )}
        <div
          ref={sectionRef as LegacyRef<HTMLDivElement>}
          className={`absolute right-0 w-[520px] ${
            isOpenMenu ? 'h-[80vh]' : 'h-0'
          } transition-[height] duration-200 bg-white overflow-x-hidden overflow-y-auto`}
        >
          <div className='h-full px-8 py-16 flex flex-col items-start gap-6'>
            <h1 className='text-4xl font-bold uppercase tracking-[2px]'>
              {title}
            </h1>
            <div className='flex flex-col gap-2'>
              <p className='text-neutral-500'>
                {t('title_intro', { name: 'Agilts' })}
              </p>
              <p className='text-neutral-500'>
                {t('des_intro', { name: 'Agilts' })}
              </p>
            </div>
            {user ? (
              <div className='w-full h-full font-medium flex flex-col gap-2'>
                <p className='text-4xl font-bold'>{t('welcome')}</p>
                <div>
                  <h2 className='text-2xl font-medium'>{user?.name}</h2>
                  <p>{user?.email}</p>
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
                <button
                  className='mt-auto ml-auto mb-6 bg-red-600 text-white px-8 py-2 tracking-[2px] text-lg font-bold rounded-sm'
                  onClick={handleLogout}
                  disabled={isLoadingLogout}
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className='w-full mt-auto flex justify-end gap-4'>
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
          </div>
        </div>
      </div>
    );
  }
);
MenuIcon.displayName = 'MenuIcon';
export default MenuIcon;
