'use client';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import Image from 'next/image';
import Stars from '@/components/ui/Stars';
import { useTranslations } from 'next-intl';
import { scrollToElement } from '@/lib/utils/scrollElement';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { ModalContext } from '@/contexts/ModalProvider';
import { Product, ProductOption } from '@/types/types';
import errorImage from '@/assets/not-found-img.avif';
type Props = {
  product: Product;
};
function ProductDetails({ product }: Props) {
  const { setVisibleModal } = useContext(ModalContext);
  const t = useTranslations('common');
  const [isHoverAddToCart, setIsHoverAddToCart] = useState(false);
  const [curOption, setCurOption] = useState<ProductOption>(
    () => product.options[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [fallbackImg, setFallbackImg] = useState(false);
  const [fallBackListImage, setFallBackListImage] = useState<number[]>([]);
  const renderedOptions = useMemo(() => {
    return product.options.map((o) => {
      return (
        <button
          key={o.id}
          onClick={() => setCurOption(o)}
          className={`border ${
            curOption.id === o.id
              ? 'border-red-500 text-red-500'
              : 'border-neutral-300'
          } px-4 py-1 font-bold`}
        >
          {o.model_name}
        </button>
      );
    });
  }, [product.options, curOption]);
  const handleEnterQuantity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setQuantity((_) => {
        if (Number(value) <= 1) return 1;
        if (Number(value) >= 100) return 100;
        return Number(value);
      });
    },
    []
  );
  const handleDecrease = useCallback(() => {
    setQuantity((prevQuantity) => {
      if (prevQuantity <= 1) return 1;
      return prevQuantity - 1;
    });
  }, []);
  const handleIncrease = useCallback(() => {
    setQuantity((prevQuantity) => {
      if (prevQuantity >= 100) return 100;
      return prevQuantity + 1;
    });
  }, []);
  return (
    <section className='container md:m-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-2 gap-16 py-8 md:py-16 overflow-hidden'>
      <div className='col-span-1 flex flex-col items-start gap-6'>
        <Image
          className='w-full object-cover border border-neutral-300 rounded-sm cursor-pointer'
          fetchPriority='high'
          width={550}
          height={600}
          src={
            fallbackImg ? errorImage : (curOption.images[0]?.image as string)
          }
          alt={product.images[0]?.alt as string}
          onError={() => setFallbackImg(true)}
          onClick={() =>
            setVisibleModal({
              visibleImageModal: {
                curImage: 0,
                totalImages: curOption.images.length,
                images: curOption.images,
              },
            })
          }
        />
        <div className='w-full grid grid-cols-3 gap-6'>
          {curOption?.images?.slice(0, 3)?.map((img, index: number) => {
            const isError = fallBackListImage.includes(index);

            return (
              <Image
                key={index}
                className='col-span-1 w-full object-cover border border-neutral-300 rounded-sm cursor-pointer'
                src={isError ? errorImage : img.image}
                alt={img?.alt as string}
                width={250}
                height={180}
                onError={() =>
                  setFallBackListImage([...fallBackListImage, index])
                }
                onClick={() =>
                  setVisibleModal({
                    visibleImageModal: {
                      curImage: index,
                      totalImages: curOption.images.length,
                      images: curOption.images,
                    },
                  })
                }
              />
            );
          })}
        </div>
      </div>
      <div className='col-span-1 flex flex-col gap-8'>
        <div className='flex flex-col gap-2'>
          <p className='text-base md:text-lg font-bold flex items-center gap-4'>
            <span>{t('status')}:</span>
            <span className='text-red-600'>{product.status}</span>
          </p>
          <h1
            title={product?.name}
            className='line-clamp-2 text-2xl md:text-4xl font-bold'
          >
            {product?.name}
          </h1>
          <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
            <p
              title={curOption?.price_preview}
              className='max-w-[280px] truncate font-bold text-lg md:text-xl'
            >
              {curOption?.price_preview}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 sm:gap-6'>
          <div className='flex items-center gap-1'>
            <Stars rate={3} size={18} />
          </div>
          <button
            type='button'
            className='text-[10px] sm:text-[12px] md:text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors uppercase'
            onClick={() => scrollToElement('reviews')}
          >
            (1 {t('customers_review')})
          </button>
        </div>
        <div className='flex flex-col gap-4'>
          <p className='uppercase font-bold text-base md:text-lg'>
            {t('options')}
          </p>
          <div className='w-full flex gap-4'>
            <ul className='flex flex-wrap gap-4'>{renderedOptions}</ul>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <p className='uppercase font-bold text-base md:text-lg'>
            {t('quick_info')}
          </p>
          <div className='text-[12px] md:text-sm font-medium flex flex-col gap-2'>
            <p className='flex gap-2'>
              <span className='text-red-500'>{t('type')}:</span>
              <span className='text-neutral-500'>{product.type}</span>
            </p>
            <p className='flex gap-2'>
              <span className='text-red-500'>SKU:</span>
              <span className='text-neutral-500'>{curOption.sku}</span>
            </p>
            {curOption.color && (
              <p className='flex gap-2'>
                <span className='text-red-500'>{t('color')}:</span>
                <span className='text-neutral-500'>{curOption.color}</span>
              </p>
            )}
            {curOption.model_name && (
              <p className='flex gap-2'>
                <span className='text-red-500'>{t('model_name')}:</span>
                <span className='text-neutral-500'>{curOption.model_name}</span>
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8'>
          <div className='w-max h-[55px] flex items-center border border-neutral-300'>
            <input
              className='w-[54px] h-full text-center p-2 bg-red-600 text-white rounded-sm'
              type='number'
              value={quantity}
              onChange={handleEnterQuantity}
            />
            <div className='h-full flex flex-col'>
              <button className='w-full h-full px-4' onClick={handleIncrease}>
                <FaAngleUp />
              </button>
              <button className='w-full h-full px-4' onClick={handleDecrease}>
                <FaAngleDown />
              </button>
            </div>
          </div>
          <button
            className='relative w-max sm:w-[220px] sm:h-[55px] uppercase bg-red-600 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center text-sm'
            onMouseEnter={() => setIsHoverAddToCart(true)}
            onMouseLeave={() => setIsHoverAddToCart(false)}
          >
            <span
              className={`w-[142px] sm:absolute sm:top-1/2 sm:left-4 sm:-translate-y-1/2 ${
                isHoverAddToCart ? 'sm:translate-x-[20%]' : 'sm:translate-x-0'
              } px-2 z-10 bg-red-600 transition-all duration-200 text-[12px]`}
            >
              {t('add_to_cart')}
            </span>
            <span className='w-full hidden sm:flex items-center'>
              <span className='w-full h-[1px] bg-white'></span>
              <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
            </span>
          </button>
        </div>
        {curOption.specifications.length > 0 && (
          <div className='flex flex-col gap-4'>
            <p className='uppercase font-bold text-base md:text-lg'>
              {t('special_specification')}
            </p>
            <ul className='py-2 sm:py-4 md:py-8 px-4 sm:px-8 bg-neutral-100 flex flex-col gap-4'>
              {curOption.specifications.map((s) => {
                return (
                  <li className='flex flex-col gap-2 text-sm' key={s.key}>
                    <p className='text-red-500 font-bold'>{s.key}</p>
                    <p className='font-bold'>{s.value}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;
