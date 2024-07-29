'use client';
import { Product, ProductOption } from '@/types/types';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { IoCartOutline } from 'react-icons/io5';
import errorImage from '@/assets/not-found-img.avif';
import { useDispatch, useSelector } from 'react-redux';
import { PopupContext } from '@/contexts/PopupProvider';
import { useResponsive } from '@/lib/hooks/useResponsive';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
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
  const searchParams = useSearchParams();
  const t = useTranslations('common');
  const selectedOption = useMemo(() => {
    return product.options.find((o) => {
      return (
        o.color === searchParams.get('color') ||
        searchParams.get('version')?.includes(o.version) ||
        (o.color === searchParams.get('color') &&
          searchParams.get('version')?.includes(o.version))
      );
    });
  }, [searchParams]);
  return (
    <div className='w-full flex items-center gap-2'>
      <p
        title={
          selectedOption
            ? selectedOption.price.preview
            : product?.options_min_price.preview
        }
        className={`w-full truncate overflow-hidden flex items-center gap-2`}
      >
        <span> {t('from')}</span>
        <span>
          {selectedOption
            ? selectedOption.price.preview
            : product?.options_min_price.preview}
        </span>
      </p>
    </div>
  );
};

SingleProduct.Image = function ProductImage({
  customClass,
}: {
  customClass?: string;
}) {
  const state = useResponsive();
  const { product } = useProductContext();
  const searchParams = useSearchParams();
  const selectedOption = useMemo(() => {
    return product.options.find((o) => {
      return (
        o.color === searchParams.get('color') ||
        searchParams.get('version')?.includes(o.version) ||
        (o.color === searchParams.get('color') &&
          searchParams.get('version')?.includes(o.version))
      );
    });
  }, [searchParams]);
  const t = useTranslations('common');
  const [fallbackImg, setFallbackImg] = useState(false);
  const { cart } = useContext(FetchDataContext);
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
      }
    },
    [dispatch, setVisiblePopup, cart]
  );
  return (
    <div
      className={`${customClass ? customClass : 'w-full h-[350px]'} relative`}
    >
      <div className={`w-full h-[${state.isDesktop ? 250 : 150}px]`}>
        <Image
          className='object-cover w-auto h-auto aspect-auto'
          src={
            fallbackImg
              ? errorImage
              : selectedOption
              ? selectedOption.images[0]?.image
              : product.images[0]?.image
          }
          alt={product.images[0]?.alt}
          fetchPriority='low'
          loading='lazy'
          onError={() => setFallbackImg(true)}
          width={state.isDesktop ? 280 : 180}
          height={state.isDesktop ? 250 : 150}
        />
      </div>
      <div
        style={{ background: 'rgba(220, 38, 38, 0.9)' }}
        className='absolute top-0 left-0 w-full h-full z-10 hidden xl:flex justify-center items-center group-hover:opacity-100 opacity-0 transition-opacity'
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
