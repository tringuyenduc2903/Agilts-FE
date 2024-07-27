'use client';
import { useCallback, useRef, useEffect } from 'react';

type Props = () => void;

const useClickOutside = (cb: Props) => {
  const sectionRef = useRef<HTMLElement | HTMLDivElement | null>(null);

  const clickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        sectionRef.current &&
        !sectionRef.current.contains(e.target as Node)
      ) {
        cb();
      }
    },
    [cb, sectionRef.current]
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sectionRef.current) {
        cb();
      }
    },
    [cb, sectionRef.current]
  );

  useEffect(() => {
    document.addEventListener('mousedown', clickOutside);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousedown', clickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [clickOutside, handleKeyPress]);

  return { sectionRef, clickOutside };
};

export default useClickOutside;
