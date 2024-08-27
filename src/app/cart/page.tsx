'use client';
import Image from 'next/image';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import { FaArrowsRotate, FaRegTrashCan } from 'react-icons/fa6';
import { useRouter, useSearchParams } from 'next/navigation';
import withAuth from '@/components/protected-page/withAuth';
import { UserContext } from '@/contexts/UserProvider';
import CustomImage from '@/components/ui/CustomImage';
import { Cart } from '@/types/types';
import { PopupContext } from '@/contexts/PopupProvider';
import CustomCheckbox from '@/components/ui/CustomCheckbox';
import {
  useDeleteCartMutation,
  useUpdateCartMutation,
} from '@/lib/redux/query/appQuery';
import { formatNumber } from '@/lib/utils/format';
function CartPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, isLoadingCart } = useContext(UserContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [products, setProducts] = useState<Cart[] | []>([]);
  const totalPrice = useMemo(() => {
    return selectedOptions.reduce((total, optionId) => {
      const curProduct = cart.find((c) => c.option_id === optionId);
      if (curProduct) {
        return total + curProduct.amount * curProduct.option.price.raw;
      }
      return total;
    }, 0);
  }, [cart, selectedOptions]);
  console.log(totalPrice);
  const [
    updateCart,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      isError: isErrorUpdate,
      error: errorUpdate,
    },
  ] = useUpdateCartMutation();
  const [
    deleteCart,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      isError: isErrorDelete,
      error: errorDelete,
    },
  ] = useDeleteCartMutation();

  const handleIncreaseQuantity = useCallback(
    (index: number) => {
      if (products.length > 0) {
        setProducts((prevProducts) =>
          prevProducts.map((p, i) =>
            i === index
              ? {
                  ...p,
                  amount: Math.min(
                    products[index].amount + 1,
                    products[index].option.quantity
                  ),
                }
              : p
          )
        );
      }
    },
    [products]
  );
  const handleDecreaseQuantity = useCallback(
    (index: number) => {
      if (products.length > 0) {
        setProducts((prevProducts) =>
          prevProducts.map((p, i) =>
            i === index
              ? { ...p, amount: Math.max(products[index].amount - 1, 1) }
              : p
          )
        );
      }
    },
    [products]
  );
  const handleChangeQuantity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, dataset } = e.target;
      const index = Number(dataset.index!);
      const newAmount = Number(value);
      if (products.length > 0) {
        setProducts((prevProducts) =>
          prevProducts.map((p, i) =>
            i === index
              ? newAmount <= 1
                ? { ...p, amount: 1 }
                : {
                    ...p,
                    amount: Math.max(
                      newAmount,
                      products[index].option.quantity
                    ),
                  }
              : p
          )
        );
      }
      return;
    },
    [products]
  );
  const handleSetSelectedOptions = useCallback((optionId: number) => {
    setSelectedOptions((prevOption) => {
      if (prevOption.includes(optionId)) {
        return prevOption.filter((o) => o !== optionId);
      }
      return [...prevOption, optionId];
    });
  }, []);
  const handlePurchase = useCallback(() => {
    router.push(
      `/purchase-item?state=${encodeURIComponent(
        JSON.stringify(selectedOptions)
      )}`
    );
  }, [router, selectedOptions]);
  useEffect(() => {
    if (cart) {
      setProducts([...cart]);
    }
  }, [cart]);
  useEffect(() => {
    const itemKey = Number(searchParams.get('itemKey'));
    if (itemKey) {
      setSelectedOptions((prevOptions) => [...prevOptions, itemKey]);
    }
  }, [searchParams.get('itemKey')]);
  useEffect(() => {
    if (isLoadingUpdate || isLoadingDelete) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingUpdate, isLoadingDelete, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessUpdate) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Cập nhật giỏ hàng thành công',
        },
      });
    }
    if (isErrorUpdate && errorUpdate) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorUpdate as any)?.data?.message,
        },
      });
    }
  }, [isSuccessUpdate, isErrorUpdate, errorUpdate, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: 'Xóa sản phẩm thành công!',
        },
      });
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorDelete as any)?.data?.message,
        },
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, setVisiblePopup]);
  const renderedCart = useMemo(() => {
    return products?.map((c, index) => {
      const isChangeValue = products[index]?.amount !== cart[index]?.amount;
      return (
        <tr key={c.id}>
          <td className='px-4'>
            <div className='w-full flex justify-center items-center'>
              <CustomCheckbox
                cb={() => handleSetSelectedOptions(c.option_id)}
                isCheck={selectedOptions.includes(c.option_id)}
              />
            </div>
          </td>
          <td className='px-2 py-4 text-center'>
            <div className='flex items-center gap-2'>
              <div className='size-[72px] overflow-hidden'>
                <CustomImage
                  image={c?.option?.images[0]}
                  width={72}
                  height={72}
                />
              </div>
              <div className='flex flex-col items-start gap-1'>
                <p
                  title={c?.option?.product?.name}
                  className='text-sm md:text-base max-w-[220px] lg:max-w-[480px] truncate'
                >
                  {c?.option?.product?.name}
                </p>
                {c?.option?.version && (
                  <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                    Phiên bản: {c?.option?.version}
                  </p>
                )}
                {c?.option?.color && (
                  <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                    Màu sắc: {c?.option?.color}
                  </p>
                )}
                {c?.option?.volume && (
                  <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                    Thể tích: {c?.option?.volume}
                  </p>
                )}
              </div>
            </div>
          </td>
          <td className='px-2 py-4 text-center'>{c?.option?.price?.preview}</td>
          <td className='px-2 py-4 text-center'>
            <div className='w-full flex justify-center items-center'>
              <div className='h-[52px] w-max border border-red-500 rounded-sm'>
                <button
                  className='h-full px-4 py-2 text-xl border-r border-red-500'
                  onClick={() => handleDecreaseQuantity(index)}
                  disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
                >
                  -
                </button>
                <input
                  className='px-4 text-center max-w-[64px]'
                  type='number'
                  data-index={index}
                  data-option={c.id}
                  value={products[index].amount}
                  onChange={handleChangeQuantity}
                  disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
                />
                <button
                  className='h-full px-4 py-2 text-xl border-l border-red-500'
                  onClick={() => handleIncreaseQuantity(index)}
                  disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
                >
                  +
                </button>
              </div>
            </div>
          </td>
          <td className='px-2 py-4 text-center'>
            {formatNumber(c?.amount * c?.option?.price?.raw)} VND
          </td>
          <td className='px-2 py-4 text-center'>
            <div className='w-full flex justify-center items-center gap-4'>
              {isChangeValue && (
                <button
                  title='Làm mới giỏ hàng'
                  aria-label='refresh-item'
                  className='w-max hover:text-green-500 transition-colors'
                  onClick={() =>
                    updateCart({ id: c.id, amount: products[index].amount })
                  }
                  disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
                >
                  <FaArrowsRotate className='text-2xl' />
                </button>
              )}
              <button
                title='Xóa sản phẩm'
                aria-label='remove-item'
                className='w-max hover:text-red-500 transition-colors'
                onClick={() => deleteCart(c.id)}
                disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
              >
                <FaRegTrashCan className='text-2xl' />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  }, [cart, products, selectedOptions]);
  return (
    <main className='w-full min-h-max py-[72px] flex flex-col gap-16'>
      <section className='absolute h-[280px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-[180px] md:h-[280px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <h1 className='text-center lg:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
          Giỏ hàng
        </h1>
      </section>
      <section className='container m-auto px-4'>
        {isLoadingCart && <div className='w-full h-[30vh] skeleton'></div>}
        {cart?.length > 0 && !isLoadingCart && (
          <div className='w-full flex flex-col gap-6'>
            <div className='w-full overflow-x-auto text-sm md:text-base'>
              <table className='w-full whitespace-nowrap'>
                <thead>
                  <tr className='uppercase font-bold tracking-wide'>
                    <td className='px-4'>
                      <div className='w-full flex justify-center items-center'>
                        <CustomCheckbox
                          cb={() =>
                            selectedOptions?.length === cart?.length
                              ? setSelectedOptions([])
                              : setSelectedOptions([
                                  ...cart?.map((c) => c.option_id),
                                ])
                          }
                          isCheck={selectedOptions?.length === cart?.length}
                        />
                      </div>
                    </td>
                    <td className='px-2 py-4 text-start'>Sản phẩm</td>
                    <td className='px-2 py-4 text-center'>Giá tiền</td>
                    <td className='px-2 py-4 text-center'>Số lượng</td>
                    <td className='px-2 py-4 text-center'>Thành tiền</td>
                    <td className='px-2 py-4 text-center'>Hành động</td>
                  </tr>
                </thead>
                <tbody className='border-t border-b border-neutral-300'>
                  {renderedCart}
                </tbody>
              </table>
            </div>
            <div className='w-full flex justify-end gap-4'>
              <div className='flex items-center gap-1 text-base md:text-lg'>
                <p>Tổng thanh toán ({selectedOptions.length} sản phẩm):</p>
                <p className='text-xl md:text-2xl font-medium text-red-500'>
                  {formatNumber(totalPrice)} VND
                </p>
              </div>
              <button
                disabled={selectedOptions.length === 0}
                className={`${
                  selectedOptions.length > 0
                    ? 'cursor-pointer bg-red-600 hover:bg-red-500'
                    : 'cursor-not-allowed bg-neutral-400'
                } text-base md:text-lg md:px-6 px-4 py-2 transition-colors text-white font-semibold rounded-sm`}
                onClick={handlePurchase}
              >
                Mua hàng
              </button>
            </div>
          </div>
        )}
        {cart?.length === 0 && !isLoadingCart && (
          <div className='flex flex-col items-center gap-6'>
            <div className='border border-neutral-300 w-full px-4 py-8 flex justify-center items-center'>
              <p className='font-bold text-neutral-800 text-base sm:text-lg md:text-xl text-center'>
                Giỏ hàng của bạn hiện đang trống.
              </p>
            </div>
            <button
              className='w-max bg-red-600 rounded-sm text-white hover:bg-neutral-800 transition-colors px-4 py-4 text-sm font-bold uppercase'
              onClick={() => router.push(`/products`)}
            >
              Quay lại cửa hàng
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default withAuth(CartPage);
