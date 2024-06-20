import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, createContext, useState, useMemo } from 'react';
import { IoCartOutline } from 'react-icons/io5';
export type Product = {
  id: string | number;
  category: string;
  title: string;
  price: string;
  salePrice: string | null;
  img: string | null;
  description: string;
};
type PropsProductContext = {
  product: Product;
  isHover: Product | null;
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
  const [isHover, setIsHover] = useState<Product | null>(null);
  const { locale } = useParams();
  const router = useRouter();
  const curLang = useMemo(() => {
    return locale || 'vi';
  }, [locale]);
  return (
    <ProductContext.Provider value={{ product, isHover }}>
      <article
        className={`${
          articleClass
            ? articleClass
            : 'col-span-1 m-auto max-w-[300px] flex flex-col gap-4 cursor-pointer'
        }`}
        onMouseEnter={() => setIsHover(product)}
        onMouseLeave={() => setIsHover(null)}
        onClick={() => router.push(`/${curLang}/products/${product.id}`)}
      >
        {children}
      </article>
    </ProductContext.Provider>
  );
}

SingleProduct.Category = function ProductCategory() {
  const { product } = useProductContext();
  return (
    <p className='font-bold text-red-500 text-[12px] md:text-sm uppercase'>
      {product.category}
    </p>
  );
};

SingleProduct.Title = function ProductTitle() {
  const { product } = useProductContext();
  return <p className='uppercase'>{product.title}</p>;
};

SingleProduct.Price = function ProductPrice() {
  const { product } = useProductContext();
  return (
    <div className='flex items-center gap-2'>
      <p
        title={product.price}
        className={`${
          product.salePrice ? 'line-through' : ''
        } max-w-[128px] truncate`}
      >
        {product.price}
      </p>
      {product.salePrice && (
        <p className='max-w-[128px] truncate' title={product.salePrice}>
          {product.salePrice}
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
  const { product, isHover } = useProductContext();
  const t = useTranslations('common');
  return (
    <div className={`${customClass ? customClass : 'max-h-[300px]'} relative`}>
      {product.img && (
        <Image
          className='w-full h-full object-cover'
          src={product.img}
          alt={product.title}
          fetchPriority='low'
        />
      )}
      <div
        style={{ background: 'rgba(220, 38, 38, 0.9)' }}
        className={`absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center ${
          isHover ? 'opacity-100' : 'opacity-0'
        } transition-opacity`}
      >
        <button className='w-max text-sm uppercase font-bold text-white flex justify-center items-center gap-2 border border-neutral-300 rounded-sm px-6 py-3'>
          <span className='uppercase'>{t('add_to_cart')}</span>
          <IoCartOutline className='text-2xl' />
        </button>
      </div>
    </div>
  );
};
