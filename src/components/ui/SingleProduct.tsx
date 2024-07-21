'use client';
import { Product, ProductOption } from '@/types/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, createContext, useState, useCallback } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import errorImage from '@/assets/not-found-img.avif';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, userCart } from '@/lib/redux/slice/userSlice';
import { PopupContext } from '@/contexts/PopupProvider';
import useResponsive from '@/lib/hooks/useResponsive';
type PropsProductContext = {
  product: Product;
};
const ProductContext = createContext<PropsProductContext | null>(null);

function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a Product!');
  }
  return context;
}
type PropsSingleProduct = {
  children: React.ReactNode;
  product: Product;
  articleClass?: string;
};
export function SingleProduct({
  children,
  product,
  articleClass,
}: PropsSingleProduct) {
  const { locale } = useParams();
  const router = useRouter();
  return (
    <ProductContext.Provider value={{ product }}>
      <article
        className={`${
          articleClass
            ? articleClass
            : 'col-span-1 m-auto max-w-[300px] flex flex-col gap-4 cursor-pointer'
        } relative group`}
        onClick={() => router.push(`/${locale}/products/${product.id}`)}
      >
        {children}
      </article>
    </ProductContext.Provider>
  );
}
SingleProduct.Category = function ProductType() {
  const { product } = useProductContext();
  const t = useTranslations('common');
  return (
    <p className='font-bold text-[12px] md:text-sm flex items-center gap-2'>
      <span>{t('category')}:</span>
      <span className='text-red-500'>{product?.categories[0].name}</span>
    </p>
  );
};
SingleProduct.Type = function ProductType() {
  const { product } = useProductContext();
  return (
    <p className='font-bold text-red-500 text-[12px] md:text-sm uppercase'>
      {product?.type}
    </p>
  );
};

SingleProduct.Title = function ProductTitle() {
  const { product } = useProductContext();
  return (
    <p
      title={product?.name}
      className='uppercase line-clamp-1 text-lg md:text-xl font-medium'
    >
      {product?.name}
    </p>
  );
};

SingleProduct.Price = function ProductPrice() {
  const { product } = useProductContext();
  const t = useTranslations('common');
  return (
    <div className='w-full flex items-center gap-2'>
      <p
        title={product?.options_min_price.preview}
        className={`w-full truncate overflow-hidden flex items-center gap-2`}
      >
        <span> {t('from')}</span>
        <span>{product?.options_min_price.preview}</span>
      </p>
    </div>
  );
};

SingleProduct.Image = function ProductImage({
  customClass,
}: {
  customClass?: string;
}) {
  const index = useResponsive();
  const { product } = useProductContext();
  const t = useTranslations('common');
  const [fallbackImg, setFallbackImg] = useState(false);
  const cart = useSelector(userCart);
  const { setVisiblePopup } = useContext(PopupContext);
  const dispatch = useDispatch();
  const handleAddToCart = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement>,
      product: ProductOption,
      productName: Product['name']
    ) => {
      e.stopPropagation();
      if (cart) {
        setVisiblePopup({
          visibleToastPopup: {
            type: 'warning',
            message: 'Bạn đã có sản phẩm khác trong giỏ hàng!',
          },
        });
      } else {
        dispatch(
          setCart({
            item: product,
            name: productName,
            quantity: 1,
          })
        );
        setVisiblePopup({
          visibleToastPopup: {
            type: 'success',
            message: 'Thêm sản phẩm thành công!',
          },
        });
      }
    },
    [dispatch, setVisiblePopup, cart]
  );
  return (
    <div
      className={`${customClass ? customClass : 'w-full h-[350px]'} relative`}
    >
      <Image
        className='object-cover w-auto h-auto'
        src={fallbackImg ? errorImage : product.images[0]?.image}
        alt={product.images[0]?.alt}
        fetchPriority='low'
        loading='lazy'
        onError={() => setFallbackImg(true)}
        width={index === 0 ? 300 : 180}
        height={index === 0 ? 280 : 150}
      />
      <div
        style={{ background: 'rgba(220, 38, 38, 0.9)' }}
        className='absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center group-hover:opacity-100 opacity-0 transition-opacity'
      >
        <button
          className='w-max text-sm uppercase font-bold text-white flex justify-center items-center gap-2 border border-neutral-300 rounded-sm px-6 py-3'
          onClick={(e) =>
            handleAddToCart(e, product?.options[0], product?.name)
          }
        >
          <span className='uppercase'>{t('add_to_cart')}</span>
          <IoCartOutline className='text-2xl' />
        </button>
      </div>
    </div>
  );
};
