'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Stars from '@/components/ui/Stars';
import { scrollToElement } from '@/lib/utils/scrollElement';
import { Product, ProductOption } from '@/types/types';
import { usePathname, useRouter } from 'next/navigation';
import { PopupContext } from '@/contexts/PopupProvider';
import { TbHeart, TbHeartFilled } from 'react-icons/tb';
import { FaCartPlus } from 'react-icons/fa6';
import CustomImage from '@/components/ui/CustomImage';
import { FaMinus } from 'react-icons/fa6';
import { UserContext } from '@/contexts/UserProvider';
import { setCookie } from 'cookies-next';
import {
  useCreateCartMutation,
  useCreateWishlistMutation,
  useDeleteWishlistMutation,
} from '@/lib/redux/query/appQuery';
type Props = {
  product: Product;
};
function ProductDetails({ product }: Props) {
  console.log(product)
  const { user, wishlist } = useContext(UserContext);
  const pathname = usePathname();
  const router = useRouter();
  const { setVisiblePopup } = useContext(PopupContext);
  const [isHoverAddToCart, setIsHoverAddToCart] = useState(false);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [curOption, setCurOption] = useState<ProductOption['version']>('');
  const [selectedOption, setSelectedOption] = useState<ProductOption[] | null>(
    null
  );
  const [selectedOptionDetails, setSelectedOptionDetails] =
    useState<ProductOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const isWishlist = useMemo(() => {
    return wishlist.find(
      (w) => w.product_preview.option_id === selectedOptionDetails?.id
    );
  }, [wishlist, selectedOptionDetails]);
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
  const versions = useMemo(() => {
    const newVersions = new Map<string, ProductOption[]>();
    product?.options?.forEach((item) => {
      if (item.version) {
        const versionOptions = newVersions.get(item.version);
        if (versionOptions) {
          versionOptions.push(item);
        } else {
          newVersions.set(item.version, [item]);
        }
      }
    });
    return Array.from(newVersions);
  }, [product]);
  useEffect(() => {
    if (versions?.length > 0) {
      setCurOption(versions[0]?.[0]);
      setSelectedOption(versions[0]?.[1]);
      setSelectedOptionDetails(versions[0]?.[1][0]);
    } else {
      setSelectedOptionDetails(product?.options[0]);
    }
  }, [product, versions]);
  const handleChangeQuantity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setQuantity(() => {
        const quantity = Number(value);
        if (quantity > (selectedOptionDetails?.quantity as number))
          return selectedOptionDetails?.quantity as number;
        if (quantity <= 0) return 1;
        return quantity;
      });
    },
    [selectedOptionDetails]
  );
  const increaseQuantity = useCallback(() => {
    setQuantity((prevQuantity) => {
      if (prevQuantity > (selectedOptionDetails?.quantity as number))
        return selectedOptionDetails?.quantity as number;
      return prevQuantity + 1;
    });
  }, [selectedOptionDetails]);
  const decreaseQuantity = useCallback(() => {
    setQuantity((prevQuantity) => {
      if (prevQuantity <= 1) return 1;
      return prevQuantity - 1;
    });
  }, []);
  const handleSetCurOption = useCallback(
    (version: string) => {
      setCurOption(version);
      const selectedDetails = versions.find((v) => v[0] === version);
      if (selectedDetails?.[1]) {
        setSelectedOption(selectedDetails?.[1]);
      }
      if (selectedDetails?.[1][0]) {
        setSelectedOptionDetails(selectedDetails?.[1][0]);
      }
    },
    [versions]
  );
  const handleBuyNow = useCallback(async () => {
    if (!user) {
      router.push(`/login`);
    } else {
      if (pathname.includes('motor-cycle')) {
        setCookie('buy_now', JSON.stringify(selectedOptionDetails), {
          expires: new Date(new Date().getTime() + 30 * 60000),
        });
        router.push(`/purchase-motorbike`);
      } else {
        setIsBuyNow(true);
        await createCart({
          option: selectedOptionDetails?.id,
          amount: quantity,
        });
      }
    }
  }, [pathname, user, router, selectedOptionDetails, quantity, createCart]);
  const renderedOptions = useMemo(() => {
    return (
      versions.map((v: any, index: number) => {
        return (
          <button
            key={index}
            onClick={() => handleSetCurOption(v[0])}
            disabled={
              isLoadingPostWishlist ||
              isLoadingDeleteWishlist ||
              isLoadingPostCart
            }
            className={`border ${
              curOption === v[0]
                ? 'border-red-500 text-red-500'
                : 'border-neutral-300'
            } px-4 py-1 font-bold`}
          >
            {v[0]}
          </button>
        );
      }) || []
    );
  }, [
    versions,
    handleSetCurOption,
    curOption,
    isLoadingPostWishlist,
    isLoadingDeleteWishlist,
    isLoadingPostCart,
  ]);
  const renderedColors = useMemo(() => {
    return (
      (selectedOptionDetails &&
        selectedOption?.map((s) => {
          return (
            <li key={s.id}>
              <button
                className={`border ${
                  selectedOptionDetails.id === s.id
                    ? 'border-red-500 text-red-500'
                    : 'border-neutral-300'
                } px-4 py-1 font-bold`}
                onClick={() => setSelectedOptionDetails(s)}
                disabled={
                  isLoadingPostWishlist ||
                  isLoadingDeleteWishlist ||
                  isLoadingPostCart
                }
              >
                {s.color}
              </button>
            </li>
          );
        })) ||
      []
    );
  }, [
    selectedOption,
    selectedOptionDetails,
    isLoadingPostWishlist,
    isLoadingDeleteWishlist,
    isLoadingPostCart,
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
    if (isSuccessPostCart && !isBuyNow) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Thêm sản phẩm thành công!',
        },
      });
    }
    if (isSuccessPostCart && isBuyNow) {
      router.push(`/cart?itemKey=${selectedOptionDetails?.id}`);
    }
    if (isErrorPostCart && errorPostCart) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorPostCart as any)?.data?.message,
        },
      });
    }
  }, [
    product,
    isSuccessPostCart,
    isErrorPostCart,
    errorPostCart,
    setVisiblePopup,
    selectedOptionDetails,
    isBuyNow,
    router,
  ]);
  return (
    <section className='container md:m-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-2 gap-16 py-8 md:py-16 overflow-hidden'>
      <div className='col-span-1 flex flex-col items-start gap-6'>
        <div className='w-full max-h-[600px] border border-neutral-300 cursor-pointer overflow-hidden'>
          <CustomImage
            image={
              selectedOptionDetails
                ? selectedOptionDetails.images[0]
                : product.images[0]
            }
            images={
              selectedOptionDetails
                ? selectedOptionDetails.images
                : product.images
            }
            isShowDetails={true}
            width={600}
            height={600}
            isErrorImageLarger={true}
            fetchPriority='high'
          />
        </div>
        <div className='w-full grid grid-cols-3 gap-6'>
          <CustomImage
            images={
              selectedOptionDetails
                ? selectedOptionDetails.images
                : product.images
            }
            isShowDetails={true}
            width={250}
            height={180}
          />
        </div>
      </div>
      <div className='col-span-1 flex flex-col gap-8'>
        <div className='flex flex-col gap-2'>
          {selectedOptionDetails && (
            <div className='flex justify-between items-center'>
              <p className='text-base md:text-lg font-bold flex items-center gap-4'>
                <span>Trạng thái:</span>
                <span className='text-red-600'>
                  {selectedOptionDetails.status}
                </span>
              </p>
              {user && (
                <button
                  className='w-max'
                  aria-label='wishlist-btn'
                  disabled={
                    isLoadingPostWishlist ||
                    isLoadingDeleteWishlist ||
                    isLoadingPostCart
                  }
                  onClick={async () =>
                    isWishlist
                      ? await deleteWishlist(selectedOptionDetails.id)
                      : await createWishlist(selectedOptionDetails.id)
                  }
                >
                  {isWishlist ? (
                    <TbHeartFilled className='text-4xl text-red-500' />
                  ) : (
                    <TbHeart className='text-4xl' />
                  )}
                </button>
              )}
            </div>
          )}
          <h1
            title={product?.name}
            className='line-clamp-2 text-2xl md:text-4xl font-bold'
          >
            {product?.name}
          </h1>
          <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
            <p
              title={selectedOptionDetails?.price.preview}
              className='max-w-[280px] truncate font-bold text-xl md:text-2xl'
            >
              {selectedOptionDetails?.price.preview}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4 sm:gap-6'>
          <div className='flex items-center gap-1'>
            <Stars rate={Number(product?.reviews_avg_rate)} size={18} />
          </div>
          <button
            type='button'
            className='text-[10px] sm:text-[12px] md:text-sm font-medium text-neutral-500 hover:text-neutral-800 transition-colors uppercase'
            onClick={() => scrollToElement('reviews')}
            disabled={
              isLoadingPostWishlist ||
              isLoadingDeleteWishlist ||
              isLoadingPostCart
            }
          >
            ({product?.reviews_count} người dùng đánh giá)
          </button>
        </div>
        {renderedOptions?.length > 0 && (
          <div className='flex flex-col gap-4'>
            <p className='uppercase font-bold text-base md:text-lg'>
              Phiên bản
            </p>
            <div className='w-full flex gap-4'>
              <ul className='flex flex-wrap gap-4'>{renderedOptions}</ul>
            </div>
          </div>
        )}
        {renderedColors?.length > 0 && (
          <div className='flex flex-col gap-4'>
            <p className='uppercase font-bold text-base md:text-lg'>Màu sắc</p>
            <div className='w-full flex gap-4'>
              <ul className='flex flex-wrap gap-4'>{renderedColors}</ul>
            </div>
          </div>
        )}
        <div className='flex flex-col gap-4'>
          <p className='uppercase font-bold text-base md:text-lg'>
            Thông tin nhanh
          </p>
          {selectedOptionDetails && (
            <div className='font-medium flex flex-col gap-2'>
              <div className='flex gap-2'>
                <p className='text-red-500'>Danh mục:</p>
                {product.categories.length > 0 ? (
                  <ul className='flex items-center gap-2'>
                    {product.categories?.map((c, index) => {
                      return (
                        <li className='flex items-center gap-2' key={c.id}>
                          <button
                            className='text-neutral-500'
                            disabled={
                              isLoadingPostWishlist || isLoadingDeleteWishlist
                            }
                            onClick={() =>
                              router.push(
                                `/products/${
                                  pathname.split('/').splice(2, 1)[0]
                                }?page=1&category=${c.id}`,
                                {
                                  scroll: true,
                                }
                              )
                            }
                          >
                            {c.name}
                          </button>
                          {index !== product.categories.length - 1 && (
                            <span>
                              <FaMinus className='text-neutral-500' />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>N/A</p>
                )}
              </div>
              <p className='flex gap-2'>
                <span className='text-red-500'>Loại sản phẩm:</span>
                <span className='text-neutral-500'>
                  {selectedOptionDetails?.type}
                </span>
              </p>
              <p className='flex gap-2'>
                <span className='text-red-500'>Công ty sản xuất:</span>
                <span className='text-neutral-500'>
                  {product?.manufacturer ? product?.manufacturer : 'N/A'}
                </span>
              </p>
              <p className='flex gap-2'>
                <span className='text-red-500'>SKU:</span>
                <span className='text-neutral-500'>
                  {selectedOptionDetails.sku}
                </span>
              </p>
              {selectedOptionDetails?.volume && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>Thể tích:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails?.volume}
                  </span>
                </p>
              )}
              {selectedOptionDetails?.weight && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>Khối lượng:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails?.weight}
                  </span>
                </p>
              )}
              {selectedOptionDetails?.length && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>Chiều dài:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails?.length}
                  </span>
                </p>
              )}
              {selectedOptionDetails?.width && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>Chiều rộng:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails?.width}
                  </span>
                </p>
              )}
              {selectedOptionDetails?.height && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>Chiều cao:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails?.height}
                  </span>
                </p>
              )}
              {selectedOptionDetails.quantity && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>Số lượng:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails.quantity > 0
                      ? selectedOptionDetails?.quantity
                      : '0'}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
        {!pathname.includes('motor-cycle') && (
          <div className='flex flex-col gap-8 w-full md:w-max'>
            <div className='flex items-center flex-col sm:flex-row gap-6'>
              <div className='h-[52px] w-max border border-red-500 rounded-sm'>
                <button
                  className='h-full px-4 py-2 text-xl border-r border-red-500'
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <input
                  className='px-4 text-center max-w-[64px]'
                  type='number'
                  value={quantity}
                  onChange={handleChangeQuantity}
                />
                <button
                  className='h-full px-4 py-2 text-xl border-l border-red-500'
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
              <button
                className='w-full md:w-max h-[52px] px-12 py-2 border border-red-500 bg-red-50 hover:bg-white text-red-500 transition-colors rounded-sm text-sm md:text-base flex justify-center items-center gap-4'
                onClick={async () =>
                  await createCart({
                    option: selectedOptionDetails?.id,
                    amount: quantity,
                  })
                }
                disabled={
                  isLoadingPostWishlist ||
                  isLoadingDeleteWishlist ||
                  isLoadingPostCart
                }
              >
                <FaCartPlus className='text-2xl' />
                <span>Thêm giỏ hàng</span>
              </button>
            </div>
            <button
              className='h-[52px] px-12 py-2 bg-red-600 border border-red-500 text-white rounded-sm text-sm md:text-base'
              onClick={handleBuyNow}
              disabled={
                isLoadingPostWishlist ||
                isLoadingDeleteWishlist ||
                isLoadingPostCart
              }
            >
              Mua ngay
            </button>
          </div>
        )}
        {pathname.includes('motor-cycle') && (
          <button
            className='relative w-max sm:w-[220px] sm:h-[55px] uppercase bg-red-600 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center text-sm'
            onMouseEnter={() => setIsHoverAddToCart(true)}
            onMouseLeave={() => setIsHoverAddToCart(false)}
            onClick={handleBuyNow}
            disabled={
              isLoadingPostWishlist ||
              isLoadingDeleteWishlist ||
              isLoadingPostCart
            }
          >
            <span
              className={`w-[142px] sm:absolute sm:top-1/2 sm:left-4 sm:-translate-y-1/2 ${
                isHoverAddToCart ? 'sm:translate-x-[20%]' : 'sm:translate-x-0'
              } px-2 z-10 bg-red-600 transition-all duration-200 text-[12px]`}
            >
              Mua ngay
            </span>
            <span className='w-full hidden sm:flex items-center'>
              <span className='w-full h-[1px] bg-white'></span>
              <span className='w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[10px] border-l-white'></span>
            </span>
          </button>
        )}
        {selectedOptionDetails &&
          selectedOptionDetails?.specifications?.length > 0 && (
            <div className='flex flex-col gap-4'>
              <p className='uppercase font-bold text-base md:text-lg'>
                Thông số đặc biệt
              </p>
              <ul className='py-2 sm:py-4 md:py-8 px-4 sm:px-8 bg-neutral-100 flex flex-col gap-4'>
                {selectedOptionDetails.specifications.map((s) => {
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
