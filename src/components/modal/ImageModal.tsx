'use client';
import React, {
  LegacyRef,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import { FaAngleLeft, FaAngleRight, FaXmark } from 'react-icons/fa6';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { ModalContext } from '@/contexts/ModalProvider';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
function ImageModal() {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const { state, setVisibleModal } = useContext(ModalContext);
  const { sectionRef, clickOutside } = useClickOutside(() =>
    setVisibleModal('visibleImageModal')
  );
  const [curImage, setCurImage] = useState(
    () => state?.visibleImageModal?.curImage || 1
  );
  const handleNext = useCallback(() => {
    setCurImage((prevImage) => {
      if (prevImage >= state?.visibleImageModal?.totalImages) return 1;
      return prevImage + 1;
    });
  }, [state?.visibleImageModal?.totalImages]);
  const handlePrev = useCallback(() => {
    setCurImage((prevImage) => {
      if (prevImage <= 1) return state?.visibleImageModal?.totalImages;
      return prevImage - 1;
    });
  }, [state?.visibleImageModal?.totalImages]);
  useGSAP(
    () => {
      if (containerRef.current && state.visibleImageModal) {
        gsap.fromTo(
          containerRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
          }
        );
      }
      if (imgRef.current && state.visibleImageModal) {
        gsap.fromTo(
          imgRef.current,
          {
            scale: 0,
          },
          {
            scale: 1,
            duration: 0.3,
            // ease: 'sine.in',
          }
        );
      }
    },
    {
      dependencies: [state.visibleImageModal, curImage],
      scope: containerRef,
    }
  );
  return (
    <section
      ref={containerRef}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className='fixed top-0 left-0 w-full h-full z-[999] flex justify-center items-center px-6'
      onClick={() => clickOutside}
    >
      <div ref={sectionRef as LegacyRef<HTMLDivElement>} className='bg-white'>
        <div className='relative max-w-[600px] max-h-[600px] w-full h-full'>
          <button
            className='absolute top-[4%] right-[4%] z-50'
            aria-label='close-image-slider'
            onClick={() => setVisibleModal('visibleImageModal')}
          >
            <FaXmark className='text-2xl text-neutral-600' />
          </button>
          {state.visibleImageModal && (
            <Image
              ref={imgRef}
              className='w-full h-full object-cover'
              src={state?.visibleImageModal?.images[curImage - 1]}
              alt='test-img'
            />
          )}
          <button
            className='absolute top-1/2 -translate-y-1/2 left-[5%] z-50'
            aria-label='left-btn-slider'
            onClick={handlePrev}
          >
            <FaAngleLeft className='text-2xl text-neutral-600' />
          </button>
          <button
            className='absolute top-1/2 -translate-y-1/2 right-[5%] z-50'
            aria-label='right-btn-slider'
            onClick={handleNext}
          >
            <FaAngleRight className='text-2xl text-neutral-600' />
          </button>
        </div>
        <div className='p-4 flex items-center'>
          <div className='flex items-center gap-2'>
            <button aria-label='left-btn-slider' onClick={handlePrev}>
              <FaAngleLeft className='text-xl text-neutral-600' />
            </button>
            <button aria-label='right-btn-slider' onClick={handleNext}>
              <FaAngleRight className='text-xl text-neutral-600' />
            </button>
          </div>
          <div className='w-full flex justify-center items-center'>
            <p className='tracking-[4px] text-neutral-600 text-sm md:text-base'>
              {curImage}/{state?.visibleImageModal?.totalImages}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImageModal;
