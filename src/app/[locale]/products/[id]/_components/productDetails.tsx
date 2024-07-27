'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Stars from '@/components/ui/Stars';
import { useTranslations } from 'next-intl';
import { scrollToElement } from '@/lib/utils/scrollElement';
import { ModalContext } from '@/contexts/ModalProvider';
import { Product, ProductOption } from '@/types/types';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCart, userCart } from '@/lib/redux/slice/userSlice';
import { PopupContext } from '@/contexts/PopupProvider';
import { TbHeart, TbHeartFilled } from 'react-icons/tb';

import CustomImage from '@/components/ui/CustomImage';
import { FaMinus } from 'react-icons/fa6';
type Props = {
  product: Product;
};
function ProductDetails({ product }: Props) {
  const { locale } = useParams();
  const { setVisibleModal } = useContext(ModalContext);
  const router = useRouter();
  const cart = useSelector(userCart);
  const t = useTranslations('common');
  const dispatch = useDispatch();
  const { setVisiblePopup } = useContext(PopupContext);
  const [isHoverAddToCart, setIsHoverAddToCart] = useState(false);
  const [curOption, setCurOption] = useState<ProductOption['version']>('');
  const [selectedOption, setSelectedOption] = useState<ProductOption[] | null>(
    null
  );
  const [selectedOptionDetails, setSelectedOptionDetails] =
    useState<ProductOption | null>(null);
  const versions = useMemo(() => {
    const newVersions = new Map<string, ProductOption[]>();
    product?.options?.forEach((item) => {
      const versionOptions = newVersions.get(item.version);
      if (versionOptions) {
        versionOptions.push(item);
      } else {
        newVersions.set(item.version, [item]);
      }
    });
    return Array.from(newVersions);
  }, [product]);
  useEffect(() => {
    setCurOption(versions[0]?.[0]);
    setSelectedOption(versions[0]?.[1]);
    setSelectedOptionDetails(versions[0]?.[1][0]);
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
  const handleAddToCart = useCallback(() => {
    if (cart && selectedOptionDetails) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'warning',
          message: 'Bạn đã có sản phẩm khác trong giỏ hàng!',
        },
      });
    } else {
      dispatch(
        setCart({
          item: selectedOptionDetails,
          name: product.name,
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
  }, [dispatch, setVisiblePopup, cart, selectedOptionDetails]);
  const renderedOptions = useMemo(() => {
    return versions.map((v: any, index: number) => {
      return (
        <button
          key={index}
          onClick={() => handleSetCurOption(v[0])}
          className={`border ${
            curOption === v[0]
              ? 'border-red-500 text-red-500'
              : 'border-neutral-300'
          } px-4 py-1 font-bold`}
        >
          {v[0]}
        </button>
      );
    });
  }, [product.options, curOption]);
  const renderedColors = useMemo(() => {
    return (
      selectedOptionDetails &&
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
            >
              {s.color}
            </button>
          </li>
        );
      })
    );
  }, [selectedOption, selectedOptionDetails]);
  return (
    <section className='container md:m-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-2 gap-16 py-8 md:py-16 overflow-hidden'>
      <div className='col-span-1 flex flex-col items-start gap-6'>
        <div className='w-full'>
          <CustomImage
            className='border border-neutral-300 rounded-sm'
            image={
              selectedOptionDetails
                ? selectedOptionDetails.images[0]
                : product.images[0]
            }
            images={product.images}
            isShowDetails={true}
            width={550}
            height={600}
            isErrorImageLarger={true}
            fetchPriority='high'
          />
        </div>
        <div className='w-full grid grid-cols-3 gap-6'>
          <CustomImage
            images={product.images.slice(1, 4)}
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
                <span>{t('status')}:</span>
                <span className='text-red-600'>
                  {selectedOptionDetails.status}
                </span>
              </p>
              <button aria-label='wishlist-btn'>
                <TbHeart className='text-4xl' />
              </button>
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
              title={selectedOptionDetails?.price_preview}
              className='max-w-[280px] truncate font-bold text-lg md:text-xl'
            >
              {selectedOptionDetails?.price_preview}
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
          >
            (
            {Number(product?.reviews_count) > 1
              ? `${product?.reviews_count} ${t('customers_review')}`
              : `${product?.reviews_count} ${t('customer_review')}`}
            )
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
        {renderedColors && (
          <div className='flex flex-col gap-4'>
            <p className='uppercase font-bold text-base md:text-lg'>
              {t('colors')}
            </p>
            <div className='w-full flex gap-4'>
              <ul className='flex flex-wrap gap-4'>{renderedColors}</ul>
            </div>
          </div>
        )}
        <div className='flex flex-col gap-4'>
          <p className='uppercase font-bold text-base md:text-lg'>
            {t('quick_info')}
          </p>
          {selectedOptionDetails && (
            <div className='font-medium flex flex-col gap-2'>
              <div className='flex gap-2'>
                <p className='text-red-500'>{t('categories')}:</p>
                <ul className='flex items-center gap-2'>
                  {product.categories?.map((c, index) => {
                    return (
                      <li className='flex items-center gap-2' key={c.id}>
                        <button
                          className='text-neutral-500'
                          onClick={() =>
                            router.push(
                              `/${locale}/products?page=1&category=${c.id}`,
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
              </div>
              <p className='flex gap-2'>
                <span className='text-red-500'>{t('type')}:</span>
                <span className='text-neutral-500'>
                  {selectedOptionDetails.type}
                </span>
              </p>
              <p className='flex gap-2'>
                <span className='text-red-500'>SKU:</span>
                <span className='text-neutral-500'>
                  {selectedOptionDetails.sku}
                </span>
              </p>
              {selectedOptionDetails.color && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>{t('color')}:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails.color}
                  </span>
                </p>
              )}
              {selectedOptionDetails.version && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>{t('version')}:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails.version}
                  </span>
                </p>
              )}
              {selectedOptionDetails.quantity && (
                <p className='flex gap-2'>
                  <span className='text-red-500'>{t('quantity')}:</span>
                  <span className='text-neutral-500'>
                    {selectedOptionDetails.quantity}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8'>
          <button
            className='relative w-max sm:w-[220px] sm:h-[55px] uppercase bg-red-600 text-white px-6 py-3 font-bold rounded-sm tracking-[2px] flex items-center text-sm'
            onMouseEnter={() => setIsHoverAddToCart(true)}
            onMouseLeave={() => setIsHoverAddToCart(false)}
            onClick={handleAddToCart}
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
        <div>
          <button
            className='border border-neutral-300 bg-neutral-800 text-white px-4 py-3'
            onClick={() =>
              setVisibleModal({ visibleReviewsModal: selectedOptionDetails })
            }
          >
            Thêm đánh giá sản phẩm (demo)
          </button>
        </div>
        {selectedOptionDetails &&
          selectedOptionDetails.specifications.length > 0 && (
            <div className='flex flex-col gap-4'>
              <p className='uppercase font-bold text-base md:text-lg'>
                {t('special_specification')}
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
