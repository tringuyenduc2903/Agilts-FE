'use client';
import { Product, ProductOption } from '@/types/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, {
  useContext,
  createContext,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { FaStar, FaRegHeart, FaHeart, FaCartPlus } from 'react-icons/fa6';
import { useResponsive } from '@/lib/hooks/useResponsive';
import CustomImage from './CustomImage';
import { UserContext } from '@/contexts/UserProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import {
  useCreateCartMutation,
  useCreateWishlistMutation,
  useDeleteWishlistMutation,
} from '@/lib/redux/query/appQuery';
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
  const searchParams = useSearchParams();
  const selectedOption = useMemo(() => {
    return (
      product.options.find((o) => {
        return (
          o.color === searchParams.get('color') ||
          searchParams.get('version')?.includes(o.version as string) ||
          o.type === searchParams.get('option_type') ||
          (o.color === searchParams.get('color') &&
            searchParams.get('version')?.includes(o.version as string) &&
            o.type === searchParams.get('option_type'))
        );
      }) || product.options[0]
    );
  }, [searchParams, product.options]);
  return (
    <ProductContext.Provider value={{ product, selectedOption }}>
      <article
        className={`${
          articleClass
            ? articleClass
            : 'col-span-1 m-auto max-w-[300px] flex flex-col gap-4'
        } relative group`}
      >
        <p className='absolute top-4 right-4 px-4 py-1 text-xs md:text-sm font-bold bg-red-500 text-white z-10 -rotate-3'>
          {selectedOption ? selectedOption.type : product.options[0].type}
        </p>
        {children}
      </article>
    </ProductContext.Provider>
  );
}
SingleProduct.Category = function ProductType() {
  const { product } = useProductContext();
  return (
    <p className='font-bold text-sm md:text-base flex items-center gap-2 max-w-[280px] truncate'>
      <span>Danh mục:</span>
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
  return (
    <p
      title={product?.reviews_avg_rate}
      className='font-bold flex items-center gap-2 text-sm md:text-base'
    >
      <span>Đánh giá:</span>
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
  const selectedOption = useMemo(() => {
    return product.options.find((o) => {
      return (
        o.color === searchParams.get('color') ||
        searchParams.get('version')?.includes(o.version as string) ||
        (o.color === searchParams.get('color') &&
          searchParams.get('version')?.includes(o.version as string))
      );
    });
  }, [searchParams, product.options]);
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
          <span>Từ</span>
          <span>{product?.options_min_price.preview}</span>
        </p>
      )}
    </div>
  );
};

SingleProduct.Image = function ProductImage() {
  const state = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const { product, selectedOption } = useProductContext();
  const { setVisiblePopup } = useContext(PopupContext);
  const { user, wishlist } = useContext(UserContext);
  const isWishlist = useMemo(() => {
    return wishlist.find(
      (w) => w.product_preview.option_id === selectedOption?.id
    );
  }, [wishlist, selectedOption]);
  const [
    createWishlist,
    {
      isSuccess: isSuccessPostWishlist,
      isLoading: isLoadingPostWishlist,
      isError: isErrorPostWishlist,
      error: errorPostWishlist,
    },
  ] = useCreateWishlistMutation();
  const [deleteWishlist, { isLoading: isLoadingDeleteWishlist }] =
    useDeleteWishlistMutation();
  const [
    createCart,
    {
      isSuccess: isSuccessPostCart,
      isLoading: isLoadingPostCart,
      isError: isErrorPostCart,
      error: errorPostCart,
    },
  ] = useCreateCartMutation();
  const handleWishlist = useCallback(async () => {
    if (!user) {
      router.push(`/login`);
    } else {
      if (isWishlist) {
        await deleteWishlist(isWishlist.id);
      } else {
        await createWishlist({ option: selectedOption?.id, amount: 1 });
      }
    }
  }, [
    isWishlist,
    user,
    router,
    selectedOption,
    createWishlist,
    deleteWishlist,
  ]);
  const handleAddToCart = useCallback(async () => {
    if (!user) {
      router.push(`/login`);
    } else {
      await createCart(selectedOption?.id);
    }
  }, [createCart, user, router, selectedOption]);
  useEffect(() => {
    if (isLoadingPostWishlist || isLoadingDeleteWishlist || isLoadingPostCart) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [
    isLoadingPostWishlist,
    isLoadingDeleteWishlist,
    isLoadingPostCart,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isSuccessPostWishlist) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Thêm sản phẩm vào danh sách mong muốn thành công!',
        },
      });
    }
    if (isErrorPostWishlist && errorPostWishlist) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorPostWishlist as any)?.data?.message,
        },
      });
    }
  }, [
    isSuccessPostWishlist,
    isErrorPostWishlist,
    errorPostWishlist,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isSuccessPostCart) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Thêm sản phẩm thành công!',
        },
      });
    }
    if (isErrorPostCart && errorPostCart) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorPostCart as any)?.data?.message,
        },
      });
    }
  }, [isSuccessPostCart, isErrorPostCart, errorPostCart, setVisiblePopup]);
  return (
    <div
      className={`max-h-[180px] xl:max-h-[280px] relative group h-full overflow-hidden`}
    >
      <CustomImage
        image={
          selectedOption
            ? selectedOption.images[0]
            : product.options[0].images[0]
        }
        fetchPriority='low'
        width={state.isDesktop ? 280 : 180}
        height={state.isDesktop ? 250 : 150}
      />
      {pathname.split('/products/')[1] !== 'motor-cycle' && (
        <div
          style={{ backgroundColor: 'rgb(220,38,38,0.8)' }}
          className='absolute top-0 left-0 w-full h-full z-10 bg-red-600 flex justify-center items-center gap-4 group-hover:opacity-100 opacity-0 transition-all duration-150'
        >
          <button
            className='border border-neutral-300 bg-white p-2'
            disabled={
              isLoadingDeleteWishlist ||
              isLoadingPostWishlist ||
              isLoadingPostCart
            }
            onClick={handleWishlist}
          >
            {isWishlist ? (
              <FaHeart className='text-2xl text-red-500' />
            ) : (
              <FaRegHeart className='text-2xl' />
            )}
          </button>
          <button
            className='border border-neutral-300 bg-white p-2'
            disabled={
              isLoadingDeleteWishlist ||
              isLoadingPostWishlist ||
              isLoadingPostCart
            }
            onClick={handleAddToCart}
          >
            <FaCartPlus className='text-2xl' />
          </button>
        </div>
      )}
    </div>
  );
};
