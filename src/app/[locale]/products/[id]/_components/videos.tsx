import { useResponsive } from '@/lib/hooks/useResponsive';
import { Product } from '@/types/types';
import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

type Props = {
  videos: Product['videos'];
};
function Videos({ videos }: Props) {
  const state = useResponsive();
  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    event.target.pauseVideo();
  };
  const opts: YouTubeProps['opts'] = {
    width: state.isDesktop ? '1000' : '280',
    height: state.isDesktop ? '390' : '280',
    playerVars: {
      autoplay: 1,
    },
  };
  return (
    <section className='container md:m-auto px-6 md:px-0 flex flex-col gap-4'>
      <h2 className='text-xl md:text-2xl font-bold'>Video</h2>
      {videos && (
        <div className='sm:px-8 md:px-16 py-6 bg-neutral-100 flex justify-center items-center gap-6 rounded-sm border-t-4 border-red-600'>
          <YouTube
            videoId={videos[0]?.video?.id}
            opts={opts}
            onReady={onPlayerReady}
          />
          ;
        </div>
      )}
    </section>
  );
}

export default Videos;
