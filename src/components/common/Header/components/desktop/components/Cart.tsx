'use client';
import CustomImage from '@/components/ui/CustomImage';
import { UserContext } from '@/contexts/UserProvider';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useMemo, useState } from 'react';
function Cart() {
  const { cart } = useContext(UserContext);
  const t = useTranslations('header');
  const { locale } = useParams();
  const router = useRouter();
  const [isHoverButton, setIsHoverButton] = useState(false);
  const renderedCart = useMemo(() => {
    return cart.map((c) => {
      return (
        <article className='px-4 w-full flex gap-8' key={c.id}>
          <div className='size-[120px]'>
            <CustomImage
              image={c?.option?.images[0]}
              width={120}
              height={120}
            />
          </div>
          <div className='w-full flex flex-col gap-2'>
            <div className='flex justify-between'>
              <p
                title={c?.option?.product?.name}
                className='max-w-[280px] truncate text-lg font-bold'
              >
                {c?.option?.product?.name}
              </p>
            </div>
            <p className='flex items-center gap-2 uppercase text-red-500 text-sm font-bold'>
              <span>{t('quantity')}:</span>
              <span>{c?.amount}</span>
            </p>
            <p className='text-sm font-bold'>{c?.option?.price?.preview}</p>
          </div>
        </article>
      );
    });
  }, [cart, t]);
  return cart.length > 0 ? (
    <div className='w-full h-full flex flex-col justify-between gap-8 py-6'>
      <div className='flex flex-col gap-4 overflow-y-auto'>{renderedCart}</div>
      <div className='px-4'>
        <button
          className='w-full flex justify-center items-center bg-red-600'
          onMouseEnter={() => setIsHoverButton(true)}
          onMouseLeave={() => setIsHoverButton(false)}
          onClick={() => router.push(`/${locale}/cart`)}
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
