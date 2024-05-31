'use client';
import { scrollToTop } from '@/lib/utils/scrollElement';
import React, { useEffect, useState } from 'react';

function ScrollToTop() {
  const [isHover, setIsHover] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 640) {
        setIsDisplay(true);
      } else {
        setIsDisplay(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  console.log(window.scrollY);
  return (
    <button
      className={`fixed bottom-8 right-8 p-6 bg-red-600 rounded-sm z-[100] flex flex-col items-center ${
        isDisplay ? 'scale-100' : 'scale-0'
      } transition-transform duration-300`}
      aria-label='scroll-to-top'
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onClick={scrollToTop}
    >
      <span className='w-0 h-0 border-b-[8px] border-l-transparent border-l-[6px] border-r-transparent border-r-[6px] border-white'></span>
      <span
        className={`w-[2px] ${
          isHover ? 'h-[32px]' : 'h-0'
        } transition-[height] duration-300 bg-white`}
      ></span>
    </button>
  );
}

export default ScrollToTop;
