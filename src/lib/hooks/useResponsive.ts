import { useCallback, useEffect, useState } from 'react';

export const useResponsive = () => {
  const [state, setState] = useState({
    isMobile: false,
    isDesktop: false,
  });

  useEffect(() => {
    const onResizeHandler = () => {
      const isMobile = window.innerWidth < 1536;
      const isDesktop = window.innerWidth >= 1536;

      setState({ isMobile, isDesktop });
    };
    onResizeHandler();

    window.addEventListener('resize', onResizeHandler);

    return () => {
      window.removeEventListener('resize', onResizeHandler);
    };
  }, []);

  return state;
};
