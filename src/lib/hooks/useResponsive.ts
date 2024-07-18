import { useEffect, useState } from 'react';

function useResponsive() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIndex(1);
      } else if (window.innerWidth <= 768) {
        setIndex(2);
      } else {
        setIndex(0);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return index;
}

export default useResponsive;
