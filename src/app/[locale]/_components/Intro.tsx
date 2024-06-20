'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '../../../../public/logo.jpg';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
function Intro() {
  const [isDisplay, setIsDisplay] = useState(true);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const lineRef = useRef(null);
  const keyword1Ref = useRef(null);
  const keyword2Ref = useRef(null);
  useGSAP(
    () => {
      if (
        isDisplay &&
        imgRef.current &&
        lineRef.current &&
        keyword1Ref.current &&
        keyword2Ref.current
      ) {
        gsap.fromTo(
          imgRef.current,
          {
            display: 'none',
            opacity: 0,
            x: 500,
          },
          {
            display: 'block',
            opacity: 1,
            x: 0,
            duration: 0.5,
          }
        );
        gsap.fromTo(
          lineRef.current,
          {
            display: 'none',
            y: -100,
          },
          {
            display: 'block',
            y: 100,
            repeat: -1,
            duration: 3,
            delay: 1,
          }
        );
        gsap.fromTo(
          keyword1Ref.current,
          {
            display: 'none',
            opacity: 0,
            x: 500,
          },
          {
            display: 'block',
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: 0.2,
          }
        );
        gsap.fromTo(
          keyword2Ref.current,
          {
            display: 'none',
            opacity: 0,
            x: 500,
          },
          {
            display: 'block',
            opacity: 1,
            x: 0,
            duration: 0.5,
            delay: 0.4,
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
      <div className='w-[512px] h-[58px] flex justify-center items-center gap-4 overflow-hidden'>
        <div className='relative opacityAnimation'>
          <Image
            ref={imgRef}
            className='object-cover relative z-0'
            src={logo}
            alt='logo'
            width={128}
            height={58}
            fetchPriority='high'
          />
        </div>
        <div className='w-[6px] h-[72px] relative rotate-[15deg]'>
          <span
            ref={lineRef}
            className='absolute top-0 left-0 w-full h-full bg-red-500'
          ></span>
        </div>
        <div>
          <p ref={keyword1Ref} className='text-3xl font-extrabold italic'>
            Grand
          </p>
          <p ref={keyword2Ref} className='text-3xl font-extrabold italic'>
            Prix
          </p>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Intro;
