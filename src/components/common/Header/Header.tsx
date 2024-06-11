'use client';
import { Suspense, lazy, useEffect, useState } from 'react';
const DesktopNavigation = lazy(() => import('./components/desktop'));
const MobileNavigation = lazy(() => import('./components/mobile'));
function Header() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <Suspense>
      {isMobile && <MobileNavigation />}
      {!isMobile && <DesktopNavigation />}
    </Suspense>
  );
}

export default Header;
