'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { title } from '@/config/title';
function Intro() {
  const [isDisplay, setIsDisplay] = useState(true);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  useGSAP(
    () => {
      if (isDisplay && imgRef.current) {
        gsap.fromTo(
          '.title-word',
          {
            x: 500,
            opacity: 0,
          },
          {
            delay: 0.5,
            x: 0,
            rotate: 360,
            opacity: 1,
            yoyo: true,
            stagger: 0.25,
            ease: 'circ.inOut',
          }
        );
        gsap.fromTo(
          imgRef.current,
          {
            display: 'none',
            opacity: 0,
            x: 500,
          },
          {
            rotate: 360,
            display: 'block',
            opacity: 1,
            x: 0,
            duration: 0.5,
          }
        );
      }
    },
    { dependencies: [], scope: containerRef }
  );
  useEffect(() => {
    if (isDisplay) {
      const timeout = setTimeout(() => {
        setIsDisplay(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);
  return isDisplay ? (
    <div
      ref={containerRef}
      className='fixed top-0 left-0 w-full h-full z-[99999999] bg-white justify-center items-center flex overflow-hidden'
    >
      <div className='w-[512px] flex justify-center items-center overflow-hidden'>
        <div className='relative opacityAnimation'>
          <div ref={imgRef} className='h-[64px]'>
            <Image
              className='w-full h-full object-cover relative z-0'
              src={logo}
              alt='logo'
              fetchPriority='high'
            />
          </div>
        </div>
        <div className='flex items-center gap-2'>
          {title
            .replace('A', '')
            .split('')
            .map((w: string, index: number) => {
              return (
                <p
                  className='text-[56px] uppercase font-extrabold title-word'
                  key={index}
                >
                  {w}
                </p>
              );
            })}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Intro;
