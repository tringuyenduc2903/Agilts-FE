import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import errorImage from '@/assets/not-found-img.avif';
import errorImageLarger from '@/assets/not-found-img-larger.png';
import { ModalContext } from '@/contexts/ModalProvider';
type SingleImage = {
  image: string;
  alt: string;
};
type Props = {
  image?: SingleImage;
  images?: SingleImage[];
  fetchPriority?: 'high' | 'low' | 'auto';
  width?: number;
  height?: number;
  isErrorImageLarger?: boolean;
  isShowDetails?: boolean;
  className?: string;
};
function CustomImage({
  image,
  images,
  fetchPriority,
  width,
  height,
  isErrorImageLarger,
  isShowDetails,
}: Props) {
  const [fallbackImg, setFallbackImg] = useState(false);
  const [fallBackListImage, setFallBackListImage] = useState<number[]>([]);
  const { setVisibleModal } = useContext(ModalContext);
  useEffect(() => {
    setFallbackImg(false);
    setFallBackListImage([]);
  }, [image?.image, images]);
  if (image) {
    return (
      <Image
        className='object-cover w-full h-full bg-center'
        width={width}
        height={height}
        src={
          fallbackImg
            ? isErrorImageLarger
              ? errorImageLarger
              : errorImage
            : image?.image
        }
        alt={image?.alt}
        fetchPriority={fetchPriority ? fetchPriority : 'low'}
        onError={() => setFallbackImg(true)}
        onClick={() => {
          if (isShowDetails) {
            return setVisibleModal({
              visibleImageModal: {
                curImage: 0,
                totalImages: images && images?.length > 0 ? images.length : 1,
                images: images && images?.length > 0 ? images : [image],
              },
            });
          } else {
            return;
          }
        }}
      />
    );
  }
  if (!image && images && images?.length > 0) {
    return (
      <React.Fragment>
        {images?.slice(0, 3).map((img, index) => {
          const isError = fallBackListImage.includes(index);
          return (
            <Image
              key={index}
              className='object-cover cursor-pointer border border-neutral-300'
              src={
                isError
                  ? isErrorImageLarger
                    ? errorImageLarger
                    : errorImage
                  : img?.image
              }
              alt={img?.alt}
              fetchPriority={fetchPriority ? fetchPriority : 'low'}
              onError={() =>
                setFallBackListImage([...fallBackListImage, index])
              }
              width={width}
              height={height}
              onClick={() => {
                if (isShowDetails) {
                  return setVisibleModal({
                    visibleImageModal: {
                      curImage: index,
                      totalImages: images.length,
                      images: images,
                    },
                  });
                } else {
                  return;
                }
              }}
            />
          );
        })}
      </React.Fragment>
    );
  }
  return <></>;
}

export default React.memo(CustomImage);
