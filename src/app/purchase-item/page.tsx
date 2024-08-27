'use client';
import Image from 'next/image';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import logo from '../../../public/logo.png';
import { useRouter, useSearchParams } from 'next/navigation';
import { Cart } from '@/types/types';
import { UserContext } from '@/contexts/UserProvider';
import Table from '@/components/ui/Table';
import CustomImage from '@/components/ui/CustomImage';
import { FaLocationDot } from 'react-icons/fa6';
import { ModalContext } from '@/contexts/ModalProvider';
import { PopupContext } from '@/contexts/PopupProvider';
import { title } from '@/config/config';
import { formatNumber } from '@/lib/utils/format';
import { useCreateOrderMutation } from '@/lib/redux/query/appQuery';
import { setCookie } from 'cookies-next';
import ProgressItem from '@/components/common/Progress/ProgressItem';

function PurchaseItemLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, cart, defaultAddress } = useContext(UserContext);
  const [items, setItems] = useState<Cart[]>([]);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const noteRef = useRef<HTMLInputElement | null>(null);
  const [curPayment, setCurPayment] = useState(0);
  const [
    createOrder,
    {
      data: orderData,
      isLoading: isLoadingOrder,
      isSuccess: isSuccessOrder,
      isError: isErrorOrder,
      error: errorOrder,
    },
  ] = useCreateOrderMutation();
  const errors = useMemo(() => {
    return isErrorOrder && (errorOrder as any)?.data;
  }, [isErrorOrder, errorOrder]);
  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.amount * item.option.price.raw;
    }, 0);
  }, [items]);
  useEffect(() => {
    const stateParam = searchParams.get('state');
    if (stateParam) {
      const listItems = JSON.parse(decodeURIComponent(stateParam)).map(
        (i: string | number) => Number(i)
      );
      const filteredItems = cart.filter((c) => listItems.includes(c.option_id));
      setItems(filteredItems);
    }
  }, [searchParams, cart]);
  const handleOrder = useCallback(async () => {
    const form = {
      address: defaultAddress?.id,
      invoice_products: items.map((i) => {
        return { option: i.option_id, amount: i.amount };
      }),
      vehicle_registration_support: false,
      shipping_type: 0,
      transaction_type: 0,
      preview: true,
      note: noteRef.current?.value ? noteRef.current?.value : '',
    };
    await createOrder(form);
  }, [defaultAddress, items, noteRef, createOrder]);
  useEffect(() => {
    if (isLoadingOrder) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingOrder, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessOrder && orderData) {
      setCookie(
        'success-order',
        JSON.stringify({ type: 'motor', data: orderData }),
        {
          expires: new Date(new Date().getTime() + 5 * 60000),
        }
      );
      router.push('/success-order');
    }
    if (isErrorOrder && errorOrder) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: (errorOrder as any)?.data?.message,
        },
      });
    }
  }, [
    isSuccessOrder,
    orderData,
    router,
    isErrorOrder,
    errorOrder,
    setVisibleModal,
  ]);
  return (
    <main className='w-full min-h-max py-[72px] flex flex-col gap-16'>
      <section className='py-6 border-b border-neutral-300 shadow-md'>
        <div className='container m-auto px-4 flex items-center gap-4'>
          <div className='flex items-center'>
            <Image className='size-16 md:size-20' src={logo} alt='logo' />
            <h1 className='text-xl md:text-2xl font-medium'>
              {title?.replace('A', '')}
            </h1>
          </div>
          <div className='px-4 border-l border-neutral-500'>
            <p className='text-xl md:text-2xl font-medium'>Đặt hàng</p>
          </div>
        </div>
      </section>
      <section className='container m-auto px-4 flex flex-col gap-6'>
        <div className='w-full px-6'>
          <ProgressItem step={1} />
        </div>
        <div className='flex flex-col gap-4'>
          <div className='text-red-500 flex items-center gap-4'>
            <FaLocationDot className='text-xl md:text-2xl' />
            <h1 className='text-xl md:text-2xl'>Địa chỉ</h1>
          </div>
          <div className='flex flex-col xl:flex-row gap-4 xl:gap-8'>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 font-bold text-base md:text-lg'>
              <p>{user?.name}</p>
              {user?.phone_number ? (
                <p>{user?.phone_number}</p>
              ) : (
                <button
                  className='text-blue-500 hover:text-blue-600 transition-colors text-xs md:text-sm'
                  onClick={() => router.push(`/user/settings/account`)}
                  disabled={isLoadingOrder}
                >
                  Chưa có số điện thoại
                </button>
              )}
            </div>
            {defaultAddress ? (
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm md:text-base'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                  <p>{defaultAddress?.address_preview}</p>
                  {defaultAddress?.default && (
                    <p className='w-max px-1 border border-red-500 text-red-500 text-xs md:text-sm'>
                      Mặc định
                    </p>
                  )}
                </div>
                <button
                  className='w-max text-xs md:text-sm text-blue-500 hover:text-blue-600 transition-colors'
                  onClick={() => setVisibleModal('visibleListAddressModal')}
                  disabled={isLoadingOrder}
                >
                  Thay đổi
                </button>
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4'>
                  <p>Bạn chưa có địa chỉ mặc định nào.</p>
                  <button
                    className='w-max text-blue-500 font-bold text-xs md:text-sm'
                    onClick={() => setVisibleModal('visibleAddAddressModal')}
                    disabled={isLoadingOrder}
                  >
                    Thêm địa chỉ
                  </button>
                </div>
                {errors?.errors?.address && (
                  <p className='text-red-500 font-bold text-sm md:text-base'>
                    {errors.errors.address[0]}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <Table
          tHeader={['Sản phẩm', 'Giá', 'Số lượng', 'Thành tiền']}
          renderedData={items?.map((i) => {
            return (
              <tr key={i.id}>
                <td className='px-2 py-4 text-center'>
                  <div className='flex justify-center items-center gap-2'>
                    <div className='size-[72px] overflow-hidden'>
                      <CustomImage
                        image={i?.option?.images[0]}
                        width={72}
                        height={72}
                      />
                    </div>
                    <div className='flex flex-col items-start gap-1'>
                      <p
                        title={i?.option?.product?.name}
                        className='text-sm md:text-base max-w-[220px] lg:max-w-[480px] truncate'
                      >
                        {i?.option?.product?.name}
                      </p>
                      {i?.option?.version && (
                        <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                          Phiên bản: {i?.option?.version}
                        </p>
                      )}
                      {i?.option?.color && (
                        <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                          Màu sắc: {i?.option?.color}
                        </p>
                      )}
                      {i?.option?.volume && (
                        <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                          Thể tích: {i?.option?.volume}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className='px-2 py-4 text-center'>
                  {i?.option?.price?.preview}
                </td>
                <td className='px-2 py-4 text-center'>{i?.amount}</td>
                <td className='px-2 py-4 text-center'>
                  {formatNumber(i.option.price.raw * i.amount)} VND
                </td>
              </tr>
            );
          })}
        />
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='w-full md:w-1/2 flex-1 flex flex-col sm:flex-row sm:items-center gap-2'>
            <h2 className='text-sm md:text-base flex items-center'>
              Ghi chú
              <span className='sm:block hidden'>:</span>
            </h2>
            <input
              className='flex-1 border border-neutral-300 px-4 py-1 text-base'
              type='text'
              placeholder='Lưu ý cho người bán...'
              ref={noteRef}
            />
          </div>
          <div className='w-full md:w-1/2 flex justify-end gap-4'>
            <p>Tổng số tiền ({items.length} sản phẩm):</p>
            <p className='text-lg md:text-xl text-red-500 font-medium'>
              {formatNumber(totalPrice)} VND
            </p>
          </div>
        </div>
        <div className='py-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6'>
          <p className='text-lg md:text-xl font-medium'>
            Phương thức thanh toán
          </p>
          <div className='flex flex-col md:flex-row md:items-center gap-4'>
            <button
              className={`px-4 py-3 font-medium border ${
                curPayment === 0
                  ? 'border-red-500 text-red-500'
                  : 'border-neutral-300'
              } text-sm md:text-base`}
              onClick={() => setCurPayment(0)}
            >
              Thanh toán khi nhận hàng
            </button>
            <button
              className='px-4 py-3 font-medium border border-neutral-300 text-sm md:text-base opacity-50 cursor-not-allowed'
              disabled
            >
              Thanh toán bằng ngân hàng
            </button>
          </div>
        </div>
        <div className='ml-auto w-full md:w-1/2 lg:w-1/3 xl:w-1/4 py-6 flex flex-col gap-4 items-end'>
          <div className='w-full flex justify-between items-center gap-4'>
            <p className='text-sm md:text-base text-neutral-500'>
              Tổng tiền hàng:
            </p>
            <p className='text-sm md:text-base text-neutral-500'>
              {formatNumber(totalPrice)} VND
            </p>
          </div>
          <div className='w-full flex justify-between items-center gap-4'>
            <p className='text-sm md:text-base text-neutral-500'>
              Phí vận chuyển:
            </p>
            <p className='text-sm md:text-base text-neutral-500'>0 VND</p>
          </div>
          <div className='w-full flex justify-between items-center gap-4'>
            <p className='text-sm md:text-base text-neutral-500'>
              Tổng thanh toán:
            </p>
            <p className='text-lg md:text-xl text-red-500 font-bold'>
              {formatNumber(totalPrice)} VND
            </p>
          </div>
        </div>
        <div className='w-full flex flex-col md:flex-row justify-between md:items-center gap-4'>
          <p className='text-sm md:text-base'>
            Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân theo{' '}
            <button className='text-sm md:text-base text-blue-500'>
              Điều khoản {title}
            </button>
          </p>
          <button
            className={`px-12 py-2 text-base md:text-lg bg-red-500 text-white font-bold ${
              isLoadingOrder || items.length === 0
                ? 'cursor-not-allowed'
                : 'cursor-pointer'
            }`}
            onClick={handleOrder}
            disabled={isLoadingOrder || items.length === 0}
          >
            Đặt hàng
          </button>
        </div>
      </section>
    </main>
  );
}

export default PurchaseItemLayout;
