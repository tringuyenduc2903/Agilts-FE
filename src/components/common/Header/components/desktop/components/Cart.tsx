'use client';
import { removeCart, userCart } from '@/lib/redux/slice/userSlice';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';

function Cart() {
  const cart = useSelector(userCart);
  const t = useTranslations('header');
  const [isHoverButton, setIsHoverButton] = useState(false);
  const dispatch = useDispatch();
  return cart ? (
    <div className='w-full h-full py-12 flex flex-col justify-between gap-8'>
      <div className='px-4 w-full flex gap-4'>
        <Image
          className='w-ful h-full object-cover border border-neutral-300'
          src={cart.images[0]}
          alt='product-image'
          width={120}
          height={120}
        />
        <div className='w-full flex flex-col justify-between'>
          <div className='flex justify-between'>
            <p
              title={cart.name}
              className='max-w-[280px] truncate text-lg font-bold'
            >
              {cart.name}
            </p>
            <button
              className='hover:text-red-500 text-neutral-500 transition-colors'
              aria-label='remove-item'
            >
              <FaXmark
                className='text-xl'
                onClick={() => dispatch(removeCart(null))}
              />
            </button>
          </div>
          <p className='flex items-center gap-2 uppercase text-red-500 text-sm font-bold'>
            <span>{t('quantity')}:</span>
            <span>{cart.quantity}</span>
          </p>
          <p className='text-sm font-bold'>{cart.price_preview}</p>
        </div>
      </div>
      <div className='bg-neutral-100 p-4 flex justify-between'>
        <p className='uppercase font-bold'>{t('order_total')}:</p>
        <p
          title={cart.price_preview}
          className='max-w-[280px] truncate font-bold'
        >
          {cart.price_preview}
        </p>
      </div>
      <div className='px-4'>
        <button
          className='w-full flex justify-center items-center bg-red-600'
          onMouseEnter={() => setIsHoverButton(true)}
          onMouseLeave={() => setIsHoverButton(false)}
        >
          <div className='relative w-[240px] h-[55px] uppercase text-white px-8 py-3 font-bold rounded-sm tracking-[2px] flex justify-center items-center text-sm'>
            <span
              className={`w-[142px] absolute top-1/2 left-8 -translate-y-1/2 ${
                isHoverButton ? 'translate-x-[17%]' : 'translate-x-0'
              } px-2 z-10 bg-red-600 transition-all duration-200 text-[12px]`}
            >
              {t('view_cart')}
            </span>
            <span className='w-full flex items-center'>
              <span className='w-full h-[1px] bg-white'></span>
              <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
            </span>
          </div>
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Cart;
