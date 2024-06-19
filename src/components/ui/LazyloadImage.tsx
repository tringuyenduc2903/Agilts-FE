'use client';
import React, { useEffect, useRef, useState } from 'react';

type LazyLoadImageProps = {
  width?: number;
  height?: number;
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: 'high' | 'low' | 'auto';
};

function LazyLoadImage(props: LazyLoadImageProps) {
  const [_, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  useEffect(() => {
    const observerSupported = 'IntersectionObserver' in window;
    const imgElement = imgRef.current;

    if (observerSupported && imgElement) {
      imgElement.classList.add('skeleton');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              setImageSrc(props.src);
            }
          });
        },
        { rootMargin: '0px', threshold: 0.1 }
      );

      observer.observe(imgElement);
      return () => observer.disconnect();
    }
  }, [props.src]);

  // Function to handle image loaded
  const handleImageLoad = () => {
    setImageLoaded(true);
    const imgElement = imgRef.current;
    if (imgElement) {
      imgElement.classList.remove('skeleton');
    }
  };

  return (
    <picture>
      <img
        ref={imgRef}
        className={`${props.className ? props.className : ''} w-full h-[${
          props.height ? props?.height : '100%'
        }px] object-cover`}
        width={props.width}
        height={props.height}
        src={imageSrc}
        alt={props.alt}
        fetchPriority={props.priority ? props.priority : 'low'}
        onLoad={handleImageLoad}
      />
    </picture>
  );
}

export default LazyLoadImage;
