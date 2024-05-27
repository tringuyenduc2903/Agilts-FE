'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { banners } from './bannerData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
function Banner() {
  const [isHoverButton, setIsHoverButton] = useState<String | null>(null);
  const [curSlide, setCurSlide] = useState(0);
  const [isAutoChangeSlide, setIsAutoChangeSlide] = useState(true);
  const container = useRef<HTMLScriptElement | null>(null);
  const subTitleRef = useRef<HTMLHeadingElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const skuRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const btnRef = useRef<HTMLDivElement | null>(null);
  const tagRef = useRef<HTMLParagraphElement | null>(null);
  useGSAP(
    () => {
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          {
            opacity: 0,
          },
          { opacity: 100, duration: 50 }
        );
      }
      if (skuRefs.current.length > 0) {
        skuRefs.current.forEach((el, index) => {
          if (el) {
            gsap.fromTo(
              el,
              { opacity: 0, skewY: 100 },
              { opacity: 0.2, skewY: 0, duration: 0.5, delay: index * 0.3 }
            );
          }
        });
      }
      if (subTitleRef.current) {
        gsap.fromTo(
          subTitleRef.current,
          {
            opacity: 0,
            x: 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
          }
        );
      }
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            x: 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            delay: 0.3,
          }
        );
      }
      if (descriptionRef.current) {
        gsap.fromTo(
          descriptionRef.current,
          {
            opacity: 0,
            x: 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            delay: 0.5,
          }
        );
      }
      if (tagRef.current) {
        gsap.fromTo(
          tagRef.current,
          {
            opacity: 0,
            x: 20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
          }
        );
      }
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          {
            opacity: 0,
            x: 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            delay: 0.6,
          }
        );
      }
    },
    { dependencies: [curSlide], scope: container }
  );
  const handlePrevSlide = () => {
    setCurSlide((prevSlide) => {
      if (prevSlide === 0) return banners?.length - 1;
      return prevSlide - 1;
    });
  };

  const handleNextSlide = () => {
    setCurSlide((prevSlide) => {
      if (prevSlide === banners?.length - 1) return 0;
      return prevSlide + 1;
    });
  };

  useEffect(() => {
    if (isAutoChangeSlide) {
      const autoChangeSlide = setInterval(() => {
        handleNextSlide();
      }, 5000);
      return () => {
        clearInterval(autoChangeSlide);
      };
    }
  }, [isAutoChangeSlide]);
  return (
    <section
      className='relative w-full h-screen overflow-hidden'
      ref={container}
    >
      <article className='w-full h-full'>
        <div className='w-full h-full' ref={imgRef}>
          <Image
            className='w-full h-full'
            objectFit='cover'
            src={banners[curSlide].img}
            alt={banners[curSlide].sku}
          />
        </div>
        <div className='absolute top-0 left-0 w-full h-full z-10 flex justify-between items-center'>
          <div className='flex items-center'>
            <div className='h-full w-1/2 flex items-center gap-2'>
              {banners[curSlide].sku.split('').map((s, index) => {
                return (
                  <p
                    key={index}
                    ref={(el) => {
                      skuRefs.current[index] = el;
                    }}
                    className='text-[290px] uppercase font-bold text-neutral-200 opacity-30'
                  >
                    {s}
                  </p>
                );
              })}
            </div>
          </div>
          <div className='h-full w-1/2 grid grid-cols-8 gap-8'>
            <div className='col-span-5 h-full flex flex-col justify-center gap-8'>
              <h1
                ref={subTitleRef}
                className='uppercase text-red-600 font-medium tracking-[16px]'
              >
                {banners[curSlide].subTitle}
              </h1>
              <h2
                ref={titleRef}
                className='text-[70px] h-[130px] leading-[64px] tracking-[8px] text-neutral-100 font-bold'
              >
                {banners[curSlide].title}
              </h2>
              <p
                ref={descriptionRef}
                className='text-neutral-50 text-medium text-lg'
              >
                {banners[curSlide].description}
              </p>
              {banners[curSlide] && (
                <div ref={btnRef} className='text-sm flex items-center gap-6'>
                  <button
                    className='relative w-[195px] h-[55px] uppercase bg-red-600 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
                    onMouseEnter={() => setIsHoverButton('view-more')}
                    onMouseLeave={() => setIsHoverButton(null)}
                  >
                    <span
                      className={`absolute top-1/2 left-4 -translate-y-1/2 ${
                        isHoverButton === 'view-more'
                          ? 'translate-x-[27%]'
                          : 'translate-x-0'
                      } px-4 z-10 bg-red-600 transition-all duration-200`}
                    >
                      View More
                    </span>
                    <span className='w-full flex items-center'>
                      <span className='w-full h-[1px] bg-white'></span>
                      <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
                    </span>
                  </button>
                  <button
                    className='relative w-[200px] h-[55px] uppercase bg-neutral-50 text-neutral-800 px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
                    onMouseEnter={() => setIsHoverButton('contact')}
                    onMouseLeave={() => setIsHoverButton(null)}
                  >
                    <span
                      className={`absolute top-1/2 left-4 -translate-y-1/2 ${
                        isHoverButton === 'contact'
                          ? 'translate-x-[23%]'
                          : 'translate-x-0'
                      } px-4 z-10 bg-white transition-all duration-200`}
                    >
                      Contact Us
                    </span>
                    <span className='w-full flex items-center'>
                      <span className='w-full h-[1px] bg-neutral-800'></span>
                      <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-neutral-700'></span>
                    </span>
                  </button>
                </div>
              )}
            </div>
            {banners[curSlide] && (
              <div className='col-span-3 h-full flex flex-col justify-center rotate-90 text-neutral-50 text-sm font-bold'>
                <div className='border-b border-neutral-200 pb-2 flex justify-between gap-4'>
                  <p className='tracking-[8px]'>0{curSlide + 1}/03</p>
                  <p ref={tagRef} className='uppercase'>
                    {banners[curSlide].tag}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
      {banners[curSlide] && (
        <div className='absolute z-20 w-full bottom-6 flex justify-between px-8'>
          <button
            className='relative w-[200px] h-[55px] uppercase bg-neutral-50 text-neutral-800 px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
            onMouseEnter={() => {
              setIsAutoChangeSlide(false);
              setIsHoverButton('prev');
            }}
            onMouseLeave={() => {
              setIsAutoChangeSlide(true);
              setIsHoverButton(null);
            }}
            onClick={handlePrevSlide}
          >
            <span
              className={`absolute top-1/2 right-4 -translate-y-1/2 ${
                isHoverButton === 'prev'
                  ? '-translate-x-[34%]'
                  : 'translate-x-0'
              } px-4 z-10 transition-all duration-200 bg-white`}
            >
              Previous
            </span>
            <span className='w-full flex items-center'>
              <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[10px] border-r-neutral-700'></span>
              <span className='w-full h-[1px] bg-neutral-800'></span>
            </span>
          </button>
          <button
            className='relative w-[200px] h-[55px] uppercase bg-neutral-50 text-neutral-800 px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
            onMouseEnter={() => {
              setIsAutoChangeSlide(false);
              setIsHoverButton('next');
            }}
            onMouseLeave={() => {
              setIsAutoChangeSlide(true);
              setIsHoverButton(null);
            }}
            onClick={handleNextSlide}
          >
            <span
              className={`absolute top-1/2 left-4 -translate-y-1/2 ${
                isHoverButton === 'next'
                  ? 'translate-x-[106%]'
                  : 'translate-x-0'
              } px-4 z-10 bg-white transition-all duration-200`}
            >
              Next
            </span>
            <span className='w-full flex items-center'>
              <span className='w-full h-[1px] bg-neutral-800'></span>
              <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-neutral-700'></span>
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

export default Banner;
