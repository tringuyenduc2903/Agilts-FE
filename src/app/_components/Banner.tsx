'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { banners } from './bannerData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
function Banner() {
  const router = useRouter();
  const { t } = useTranslation('common');
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
      className='relative pt-[72px] w-full h-[70vh] md:h-screen overflow-hidden'
      ref={container}
    >
      {banners?.map((b: any, index: number) => {
        return (
          <article
            className={`w-full h-full absolute ${
              curSlide === index ? 'z-20' : '-z-20'
            }`}
            key={index}
          >
            <div
              className='w-full h-full'
              ref={curSlide === index ? imgRef : null}
            >
              <Image
                className='w-full h-full object-cover'
                src={b.img}
                alt={b.sku}
                fetchPriority='high'
              />
            </div>
            <div className='absolute top-0 left-0 w-full h-full z-10 flex justify-between items-center'>
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 xl:top-0 xl:left-0 xl:-translate-x-0 xl:-translate-y-0 xl:relative xl:w-1/2 flex items-center'>
                <div className='w-full h-full flex items-center gap-2'>
                  {curSlide === index &&
                    b.sku.split('').map((s: string, index: number) => {
                      return (
                        <p
                          key={index}
                          ref={(el) => {
                            skuRefs.current[index] = el;
                          }}
                          className='text-[72px] sm:text-[128px] md:text-[220px] xl:text-[290px] uppercase font-bold text-neutral-200 opacity-30'
                        >
                          {s}
                        </p>
                      );
                    })}
                </div>
              </div>
              <div className='py-8 md:py-0 h-full w-full xl:w-1/2 xl:grid xl:grid-cols-8 flex flex-col gap-8 px-4 sm:px-8 xl:px-0 justify-center'>
                <div className='xl:col-span-5 h-max xl:h-full flex flex-col justify-center items-center sm:items-start md:items-center xl:items-start gap-4 md:gap-8'>
                  <h1
                    ref={curSlide === index ? subTitleRef : null}
                    className='uppercase text-center sm:text-start md:text-center xl:text-start text-sm md:text-base text-red-600 font-medium tracking-[16px]'
                  >
                    {b.subTitle}
                  </h1>
                  <h2
                    ref={curSlide === index ? titleRef : null}
                    className='text-center sm:text-start md:text-center xl:text-start text-3xl sm:text-4xl md:text-[70px] md:h-[130px] leading-8 md:leading-[64px] tracking-[6px] md:tracking-[8px] text-neutral-100 font-bold'
                  >
                    {b.title}
                  </h2>
                  <p
                    ref={curSlide === index ? descriptionRef : null}
                    className='text-neutral-50 text-medium xl:w-full sm:w-2/3 w-full text-sm md:text-lg line-clamp-3 md:line-clamp-none'
                  >
                    {b.description}
                  </p>
                  {b && (
                    <div
                      ref={curSlide === index ? btnRef : null}
                      className='text-sm flex flex-col md:flex-row items-center sm:items-start md:items-center gap-4 md:gap-6'
                    >
                      <button
                        className='relative w-max sm:w-[195px] h-[36px] sm:h-[46px] md:h-[55px] text-sm md:text-base uppercase bg-red-600 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
                        onMouseEnter={() => setIsHoverButton('view-more')}
                        onMouseLeave={() => setIsHoverButton(null)}
                      >
                        <span
                          className={`w-[124px] sm:absolute sm:top-1/2 sm:left-4 sm:-translate-y-1/2 ${
                            isHoverButton === 'view-more'
                              ? 'sm:translate-x-[17%]'
                              : 'sm:translate-x-0'
                          } px-4 z-10 bg-red-600 transition-all duration-200`}
                        >
                          {t('view-more')}
                        </span>
                        <span className='w-full hidden sm:flex items-center'>
                          <span className='w-full h-[1px] bg-white'></span>
                          <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
                        </span>
                      </button>
                      <button
                        className='relative w-max sm:w-[200px] h-[36px] sm:h-[46px] md:h-[55px] text-sm md:text-base uppercase bg-neutral-50 text-neutral-800 px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center'
                        onMouseEnter={() => setIsHoverButton('contact')}
                        onMouseLeave={() => setIsHoverButton(null)}
                        onClick={() => router.push('/contact')}
                      >
                        <span
                          className={`w-[132px] sm:absolute sm:top-1/2 sm:left-4 sm:-translate-y-1/2 ${
                            isHoverButton === 'contact'
                              ? 'sm:translate-x-[14%]'
                              : 'sm:translate-x-0'
                          } px-4 z-10 bg-white transition-all duration-200`}
                        >
                          {t('contact-us')}
                        </span>
                        <span className='w-full hidden sm:flex items-center'>
                          <span className='w-full h-[1px] bg-neutral-800'></span>
                          <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-neutral-700'></span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                {b && (
                  <div className='xl:col-span-3 h-max xl:h-full flex flex-col justify-center xl:rotate-90 text-neutral-50 text-sm font-bold'>
                    <div className='border-b border-neutral-200 pb-2 flex justify-between gap-4'>
                      <p className='tracking-[8px]'>0{curSlide + 1}/03</p>
                      <p
                        ref={curSlide === index ? tagRef : null}
                        className='uppercase'
                      >
                        {b.tag}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
      {banners[curSlide] && (
        <div className='absolute z-20 w-full bottom-6 hidden md:flex justify-between px-8'>
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
