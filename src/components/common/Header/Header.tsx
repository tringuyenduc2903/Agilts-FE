'use client';
import { useResponsive } from '@/lib/hooks/useResponsive';
import { Suspense, lazy } from 'react';
const DesktopNavigation = lazy(() => import('./components/desktop'));
const MobileNavigation = lazy(() => import('./components/mobile'));
function Header() {
  const state = useResponsive();
  return (
    <Suspense>
      {state.isDesktop && <DesktopNavigation />}
      {state.isMobile && <MobileNavigation />}
    </Suspense>
  );
}

export default Header;
