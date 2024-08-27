'use client';
import { useCallback, useRef, useEffect } from 'react';

type Props = () => void;

const useClickOutside = (cb: Props) => {
  const sectionRef = useRef<HTMLElement | HTMLDivElement | null>(null);
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sectionRef.current) {
        cb();
      }
    },
    [cb]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return sectionRef;
};

export default useClickOutside;
