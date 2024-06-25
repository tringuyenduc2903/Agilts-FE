'use client';
import { useParams } from 'next/navigation';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { productsData, tagsData } from '../../_components/data';
import Image from 'next/image';
import Stars from '@/components/ui/Stars';
import { useTranslations } from 'next-intl';
import { scrollToElement } from '@/lib/utils/scrollElement';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
function ProductDetails() {
  const { id } = useParams();
  const t = useTranslations('common');
  const [isHoverAddToCart, setIsHoverAddToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
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
  const curProduct = useMemo(() => {
    return productsData.find((product) => product.id == id);
  }, [productsData, id]);
  const reviewRef = useRef(null);
  const renderedTags = useMemo(() => {
    return tagsData?.splice(0, 3).map((t, index) => {
      return (
        <li className='w-max flex justify-between gap-3' key={t.slug}>
          <button className='uppercase text-neutral-500 text-[12px] md:text-sm font-medium hover:text-red-500 transition-colors'>
            {t?.title}
          </button>
          {index !== 2 && (
            <div className='flex justify-center items-center'>
              <span className='relative w-4 h-[1px] bg-neutral-800'></span>
            </div>
          )}
        </li>
      );
    });
  }, [tagsData]);
  return (
    <section className='container md:m-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-2 gap-16 py-8 md:py-16 overflow-hidden'>
      <div className='col-span-1 flex flex-col items-start gap-6'>
        <Image
          className='w-full max-h-[600px] object-cover border border-neutral-300 rounded-sm cursor-pointer'
          src={curProduct?.img as string}
          alt={curProduct?.title as string}
        />
        <div className='w-full grid grid-cols-3 gap-6'>
          <Image
            className='col-span-1 w-full max-h-[180px] object-cover border border-neutral-300 rounded-sm cursor-pointer'
            src={curProduct?.img as string}
            alt={curProduct?.title as string}
          />
          <Image
            className='col-span-1 w-full max-h-[180px] object-cover border border-neutral-300 rounded-sm cursor-pointer'
            src={curProduct?.img as string}
            alt={curProduct?.title as string}
          />
          <Image
            className='col-span-1 w-full max-h-[180px] object-cover border border-neutral-300 rounded-sm cursor-pointer'
            src={curProduct?.img as string}
            alt={curProduct?.title as string}
          />
        </div>
      </div>
      <div className='col-span-1 flex flex-col gap-8'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl md:text-4xl font-bold'>
            {curProduct?.title}
          </h1>
          <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
            <p
              title={curProduct?.price}
              className={`max-w-[280px] truncate font-bold ${
                curProduct?.salePrice
                  ? 'line-through text-base md:text-lg'
                  : 'text-lg md:text-xl'
              }`}
            >
              {curProduct?.price}
            </p>
            {curProduct?.salePrice && (
              <p
                title={curProduct?.salePrice}
                className='max-w-[280px] truncate font-bold text-lg md:text-xl'
              >
                {curProduct?.salePrice}
              </p>
            )}
          </div>
        </div>
        <div className='flex items-center gap-4 sm:gap-6'>
          <div className='flex items-center gap-1'>
            <Stars rate={3} size={18} />
          </div>
          <button
            type='button'
            className='text-[10px] sm:text-[12px] md:text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors uppercase'
            onClick={() => scrollToElement(reviewRef)}
          >
            (1 {t('customers_review')})
          </button>
        </div>
        <p className='text-neutral-500'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla
          aliquam voluptatibus consequatur delectus, itaque repellendus omnis,
          vel dolorum dolorem deleniti reprehenderit dolore sint modi ad magni,
          nam corporis. Quam, temporibus.
        </p>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8'>
          <div className='w-max h-[55px] flex items-center border border-neutral-300'>
            <input
              className='w-[54px] h-full text-center p-2 bg-red-600 text-white rounded-sm'
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
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
        <div className='flex flex-col gap-4'>
          <p className='uppercase font-bold text-base md:text-lg'>
            {t('quick_info')}
          </p>
          <div className='text-[12px] md:text-sm font-medium flex flex-col gap-2'>
            <p className='flex gap-2'>
              <span className='text-red-500'>SKU:</span>
              <span className='text-neutral-500'>PRO01</span>
            </p>
            <p className='flex gap-2'>
              <span className='text-red-500 uppercase'>{t('categories')}:</span>
              <span className='text-neutral-500 uppercase'>
                {curProduct?.category}
              </span>
            </p>
            <div className='flex gap-2'>
              <p className='text-red-500 uppercase'>{t('tags')}:</p>
              <ul className={`flex flex-wrap gap-3 overflow-hidden`}>
                {renderedTags}
              </ul>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <p className='uppercase font-bold text-base md:text-lg'>
            {t('description')}
          </p>
          <p className='text-neutral-500'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla
            aliquam voluptatibus consequatur delectus, itaque repellendus omnis,
            vel dolorum dolorem deleniti reprehenderit dolore sint modi ad
            magni, nam corporis. Quam, temporibus.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
