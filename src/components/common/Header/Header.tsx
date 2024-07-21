'use client';
import useResponsive from '@/lib/hooks/useResponsive';
import { Suspense, lazy } from 'react';
const DesktopNavigation = lazy(() => import('./components/desktop'));
const MobileNavigation = lazy(() => import('./components/mobile'));
function Header() {
  const index = useResponsive();
  return (
    <Suspense>
      {(index === 1 || index === 2) && <MobileNavigation />}
      {index === 0 && <DesktopNavigation />}
    </Suspense>
  );
}

export default Header;
