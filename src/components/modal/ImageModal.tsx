'use client';
import React, {
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FaPlus,
  FaMinus,
  FaAngleLeft,
  FaAngleRight,
  FaXmark,
} from 'react-icons/fa6';
import useClickOutside from '@/lib/hooks/useClickOutside';
import { ModalContext } from '@/contexts/ModalProvider';
import errorImage from '@/assets/not-found-img-larger.png';
function ImageModal() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [fallbackImg, setFallbackImg] = useState(false);
  const { state, setVisibleModal } = useContext(ModalContext);
  const { sectionRef, clickOutside } = useClickOutside(() =>
    setVisibleModal('visibleImageModal')
  );
  const [curImage, setCurImage] = useState(
    () => state?.visibleImageModal?.curImage || 0
  );
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleNext = useCallback(() => {
    setCurImage((prevImage) => {
      if (prevImage >= state?.visibleImageModal?.totalImages - 1) return 0;
      return prevImage + 1;
    });
  }, [state?.visibleImageModal?.totalImages]);
  const handlePrev = useCallback(() => {
    setCurImage((prevImage) => {
      if (prevImage <= 1) return state?.visibleImageModal?.totalImages - 1;
      return prevImage - 1;
    });
  }, [state?.visibleImageModal?.totalImages]);
  const handleZoomIn = useCallback(() => {
    setScale((scale) => scale + 0.1);
  }, []);
  const handleZoomOut = useCallback(() => {
    setScale((scale) => scale - 0.1);
  }, []);
  useEffect(() => {
    const image = imgRef.current;
    let isDragging = false;
    let prevPosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevPosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevPosition.x;
      const deltaY = e.clientY - prevPosition.y;
      setPosition((position) => ({
        x: position.x + deltaX,
        y: position.y + deltaY,
      }));
      prevPosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    image?.addEventListener('mousedown', handleMouseDown);
    image?.addEventListener('mousemove', handleMouseMove);
    image?.addEventListener('mouseup', handleMouseUp);

    return () => {
      image?.removeEventListener('mousedown', handleMouseDown);
      image?.removeEventListener('mousemove', handleMouseMove);
      image?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [imgRef, scale]);
  console.log(typeof state?.visibleImageModal?.images[curImage] === 'string');
  return (
    <section
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      className='fixed top-0 left-0 w-full h-full z-[999] flex justify-center items-center px-6'
      onClick={() => clickOutside}
    >
      <div
        ref={sectionRef as LegacyRef<HTMLDivElement>}
        className='bg-white w-4/5 h-1/2 md:h-4/5 overflow-y-auto flex flex-col gap-4'
      >
        <div className='w-full flex justify-end px-4 pt-4'>
          <button
            className='w-max'
            aria-label='close-image-slider'
            onClick={() => setVisibleModal('visibleImageModal')}
          >
            <FaXmark className='text-2xl text-neutral-600' />
          </button>
        </div>
        <div className='relative flex-1 w-full h-full border border-neutral-300 overflow-hidden'>
          <div className='absolute top-0 left-0 z-50 flex flex-col bg-red-500'>
            <button
              className='p-4 text-white border-b border-neutral-300'
              aria-label='zoom-in-img'
              onClick={handleZoomIn}
            >
              <FaPlus />
            </button>
            <button
              className='p-4 text-white'
              aria-label='zoom-out-img'
              onClick={handleZoomOut}
            >
              <FaMinus />
            </button>
          </div>
          {state.visibleImageModal && (
            <img
              ref={imgRef}
              className='w-full h-full object-contain'
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              }}
              src={
                fallbackImg
                  ? errorImage
                  : typeof state?.visibleImageModal?.images[curImage] ===
                    'string'
                  ? state?.visibleImageModal?.images[curImage]
                  : state?.visibleImageModal?.images[curImage].image
              }
              alt={
                typeof state?.visibleImageModal?.images[curImage] === 'string'
                  ? state?.visibleImageModal?.images[curImage]
                  : state?.visibleImageModal?.images[curImage].alt
              }
              onError={() => setFallbackImg(true)}
              draggable={false}
            />
          )}
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
              {curImage + 1}/{state?.visibleImageModal?.totalImages}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImageModal;
