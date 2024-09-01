'use client';
import NotFoundItem from '@/components/ui/NotFoundItem';
import { useResponsive } from '@/lib/hooks/useResponsive';
import { Product } from '@/types/types';
import React, { useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
type Props = {
  specifications: Product['specifications'];
  description: Product['description'];
  videos: Product['videos'];
};
function ProductTab({ specifications, description, videos }: Props) {
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
  const [curTab, setCurTab] = useState<
    'description' | 'specification' | 'video' | 'review'
  >('description');
  return (
    <section className='container m-auto px-4 py-8 bg-neutral-100 flex flex-col gap-6'>
      <div className='flex justify-center items-center gap-8 bg-white py-4'>
        <button
          className={`${
            curTab === 'description' ? 'text-red-500' : ''
          } font-bold`}
          onClick={() => setCurTab('description')}
        >
          Mô tả
        </button>
        <button
          className={`${
            curTab === 'specification' ? 'text-red-500' : ''
          } font-bold`}
          onClick={() => setCurTab('specification')}
        >
          Thông số kỹ thuật
        </button>
        {videos && (
          <button
            className={`${curTab === 'video' ? 'text-red-500' : ''} font-bold`}
            onClick={() => setCurTab('video')}
          >
            Video
          </button>
        )}
        <button
          className={`${curTab === 'review' ? 'text-red-500' : ''} font-bold`}
          onClick={() => setCurTab('review')}
        >
          Đánh giá
        </button>
      </div>
      {curTab === 'description' && (
        <div className='py-2 sm:py-4 flex flex-col rounded-sm'>
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
        </div>
      )}
      {curTab === 'specification' && (
        <div className='py-2 sm:py-4 flex flex-col rounded-sm'>
          {specifications && specifications.length > 0 ? (
            specifications?.map((s, index: number) => {
              return (
                <div
                  key={s?.title}
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm p-4 rounded-sm ${
                    index % 2 === 0 ? 'bg-white' : ''
                  }`}
                >
                  <p
                    className='col-span-1 font-medium'
                    dangerouslySetInnerHTML={{ __html: s?.title }}
                  ></p>
                  <p
                    className='col-span-1 font-bold'
                    dangerouslySetInnerHTML={{ __html: s?.description }}
                  ></p>
                </div>
              );
            })
          ) : (
            <NotFoundItem message='Sản phẩm hiện chưa có thông số kỹ thuật.' />
          )}
        </div>
      )}
      {curTab === 'video' && videos && (
        <div className='py-2 sm:py-4 flex justify-center items-center rounded-sm'>
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

export default ProductTab;
