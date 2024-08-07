'use client';
import { Product, ProductOption } from '@/types/types';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, createContext, useMemo } from 'react';
import { FaStar } from 'react-icons/fa6';
import { useResponsive } from '@/lib/hooks/useResponsive';
import CustomImage from './CustomImage';
type PropsProductContext = {
  product: Product;
  selectedOption: ProductOption | null;
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
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const selectedOption = useMemo(() => {
    return (
      product.options.find((o) => {
        return (
          o.color === searchParams.get('color') ||
          searchParams.get('version')?.includes(o.version) ||
          o.type === searchParams.get('option_type') ||
          (o.color === searchParams.get('color') &&
            searchParams.get('version')?.includes(o.version) &&
            o.type === searchParams.get('option_type'))
        );
      }) || null
    );
  }, [searchParams]);
  return (
    <ProductContext.Provider value={{ product, selectedOption }}>
      <article
        className={`${
          articleClass
            ? articleClass
            : 'col-span-1 m-auto max-w-[300px] flex flex-col gap-4 cursor-pointer'
        } relative group`}
        onClick={() =>
          router.push(
            `/${locale}/products/${
              product.search_url ? product.search_url : product.id
            }`
          )
        }
      >
        <p className='absolute top-0 right-0 px-4 py-1 text-xs md:text-sm font-bold bg-red-500 text-white z-10 -rotate-3'>
          {selectedOption ? selectedOption.type : product.options[0].type}
        </p>
        {children}
      </article>
    </ProductContext.Provider>
  );
}
SingleProduct.Category = function ProductType() {
  const { product } = useProductContext();
  const t = useTranslations('common');
  return (
    <p className='font-bold text-sm md:text-base flex items-center gap-2 max-w-[280px] truncate'>
      <span>{t('category')}:</span>
      <span className='text-red-500'>
        {product?.categories.length > 0
          ? product?.categories?.map((c) => c.name).join(', ')
          : 'N/A'}
      </span>
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
SingleProduct.Rate = function ProductRate() {
  const { product } = useProductContext();
  const t = useTranslations('common');
  return (
    <p
      title={product?.reviews_avg_rate}
      className='font-bold flex items-center gap-2 text-sm md:text-base'
    >
      <span>{t('reviews')}:</span>
      {product?.reviews_avg_rate ? (
        <span className='flex items-center gap-1'>
          <span> {Math.ceil(Number(product?.reviews_avg_rate) * 2) / 2} </span>
          <FaStar className='text-base text-yellow-300' />
        </span>
      ) : (
        <span>N/A</span>
      )}
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
      {selectedOption ? (
        <p
          title={selectedOption.price.preview}
          className={`w-full truncate overflow-hidden flex items-center gap-2`}
        >
          {selectedOption.price.preview}
        </p>
      ) : (
        <p
          title={product?.options_min_price.preview}
          className={`w-full truncate overflow-hidden flex items-center gap-2`}
        >
          <span> {t('from')}</span>
          <span>{product?.options_min_price.preview}</span>
        </p>
      )}
    </div>
  );
};

SingleProduct.Image = function ProductImage({
  customClass,
}: {
  customClass?: string;
}) {
  const state = useResponsive();
  const { product, selectedOption } = useProductContext();
  return (
    <div
      className={`${customClass ? customClass : 'w-full h-[350px]'} relative`}
    >
      <div className='overflow-hidden'>
        <CustomImage
          className='object-cover w-auto h-auto aspect-auto bg-center'
          image={
            selectedOption
              ? selectedOption.images[0]
              : product.options[0].images[0]
          }
          fetchPriority='low'
          width={state.isDesktop ? 280 : 180}
          height={state.isDesktop ? 250 : 150}
        />
      </div>
    </div>
  );
};
