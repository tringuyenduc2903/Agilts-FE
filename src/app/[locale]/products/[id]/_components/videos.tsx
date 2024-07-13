import { Product } from '@/types/types';
import React, { useCallback, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
type Props = {
  videos: Product['videos'];
};
function Videos({ videos }: Props) {
  const [curVideo, setCurVideo] = useState(1);
  const handleNext = useCallback(() => {
    setCurVideo((prevVideo) => {
      if (prevVideo > videos.length) return 1;
      return prevVideo + 1;
    });
  }, [videos]);
  const handlePrev = useCallback(() => {
    setCurVideo((prevVideo) => {
      if (prevVideo <= 1) return videos.length;
      return prevVideo - 1;
    });
  }, [videos]);
  return (
    <section className='container md:m-auto px-6 md:px-0 flex flex-col gap-4'>
      <h2 className='text-xl md:text-2xl font-bold'>Video</h2>
      <div className='relative py-8 px-4 sm:px-8 md:px-16 bg-neutral-100 flex flex-col gap-6 rounded-sm border-t-4 border-red-600'>
        <iframe
          id={videos[curVideo - 1]?.video.id}
          className='w-full aspect-video self-stretch max-h-[380px]'
          src={`https://www.youtube.com/embed/${
            videos[curVideo - 1]?.video.id
          }`}
          allowFullScreen
          title={videos[curVideo - 1]?.title}
          aria-hidden='true'
        />
        <button
          className='absolute top-1/2 -translate-y-1/2 left-0 sm:left-4'
          aria-label='left-btn-slider'
          onClick={handlePrev}
        >
          <FaAngleLeft className='text-2xl text-neutral-600' />
        </button>
        <button
          className='absolute top-1/2 -translate-y-1/2 right-0 sm:right-4'
          aria-label='right-btn-slider'
          onClick={handleNext}
        >
          <FaAngleRight className='text-2xl text-neutral-600' />
        </button>
      </div>
    </section>
  );
}

export default Videos;
