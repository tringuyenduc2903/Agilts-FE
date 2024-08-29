'use client';
import withAuth from '@/components/protected-page/withAuth';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserContext } from '@/contexts/UserProvider';
import { TbRefresh } from 'react-icons/tb';
import { PopupContext } from '@/contexts/PopupProvider';
import { Address, Document, ProductOption } from '@/types/types';
import { ModalContext } from '@/contexts/ModalProvider';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { VehicleRegistrationSupportContext } from './_contexts/VehicleRegistrationSupportProvider';
import logo from '../../../public/logo.png';
import RegistrationOptionsModal from './_components/RegistrationOptionsModal';
import LicensePlateRegistrationOptionModal from './_components/LicensePlateRegistrationOptionModal';
import {
  useCreateOrderMutation,
  usePostPriceQuoteMutation,
} from '@/lib/redux/query/appQuery';
import ProgressMotor from '@/components/common/Progress/ProgressMotor';
import { title } from '@/config/config';
import Image from 'next/image';
type Form = {
  address: Address['id'] | null;
  identification?: Document['id'] | null;
  invoice_products: [
    {
      option: ProductOption['id'];
      amount: number;
    }
  ];
  vehicle_registration_support: boolean;
  registration_option?: number;
  license_plate_registration_option?: number;
  shipping_type: number;
  transaction_type: number;
  preview?: boolean;
};
type PriceQuote = {
  invoice_products: [
    {
      id: any;
      option: number;
      price: {
        raw: number;
        preview: string;
      };
      amount: number;
      value_added_tax: number;
    }
  ];
  price: {
    raw: number;
    preview: string;
  };
  tax: {
    raw: number;
    preview: string;
  };
  shipping_fee: {
    raw: number;
    preview: string;
  };
  vehicle_registration_support_fee: {
    raw: number;
    preview: string;
  };
  registration_fee: {
    raw: number;
    preview: string;
  };
  license_plate_registration_fee: {
    raw: number;
    preview: string;
  };
  handling_fee: {
    raw: number;
    preview: string;
  };
  total: {
    raw: number;
    preview: string;
  };
};
function PurchaseMotorbikePage() {
  const router = useRouter();
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const { user, defaultAddress, defaultDocument } = useContext(UserContext);
  const [toggleSupport, setToggleSupport] = useState(false);
  const noteRef = useRef<HTMLInputElement | null>(null);
  const [vehicleRegistrationSupportModal, setVehicleRegistrationSupportModal] =
    useState<string | null>(null);
  const { curRegistrationOptions, curLicensePlateRegistrationOption } =
    useContext(VehicleRegistrationSupportContext);
  const [product, setProduct] = useState<ProductOption | null>(null);
  useEffect(() => {
    const cookie = getCookie('buy_now');
    if (cookie) {
      setProduct(JSON.parse(cookie as string));
    } else {
      setProduct(null);
    }
  }, []);
  const [priceQuote, setPriceQuote] = useState<PriceQuote | null>(null);
  const [
    postPriceQuote,
    {
      data: priceQuoteData,
      isLoading: isLoadingPriceQuoteData,
      isSuccess: isSuccessPriceQuote,
      isError: isErrorPriceQuote,
      error: errorPriceQuote,
    },
  ] = usePostPriceQuoteMutation();
  const [
    createOrder,
    {
      data: orderData,
      isSuccess: isSuccessOrder,
      isLoading: isLoadingOrder,
      isError: isErrorOrder,
      error: errorOrder,
    },
  ] = useCreateOrderMutation();
  const errors = useMemo(() => {
    return isErrorOrder && (errorOrder as any)?.data;
  }, [isErrorOrder, errorOrder]);
  const handleCheckPrice = useCallback(async () => {
    const form: Form = {
      address: defaultAddress?.id as number,
      invoice_products: [
        {
          option: product?.id as number,
          amount: 1,
        },
      ],
      vehicle_registration_support: toggleSupport,
      shipping_type: 0,
      transaction_type: 0,
      preview: true,
    };
    if (toggleSupport) {
      form.registration_option = curRegistrationOptions.value;
      form.license_plate_registration_option =
        curLicensePlateRegistrationOption.value;
      form.identification = defaultDocument?.id as number;
    }
    await postPriceQuote(form);
  }, [
    postPriceQuote,
    product,
    defaultAddress,
    defaultDocument,
    toggleSupport,
    curRegistrationOptions,
    curLicensePlateRegistrationOption,
  ]);
  const handleOrder = useCallback(async () => {
    type Order = Form & {
      note: string;
    };
    const form: Order = {
      address: defaultAddress?.id as number,
      invoice_products: [
        {
          option: product?.id as number,
          amount: 1,
        },
      ],
      vehicle_registration_support: toggleSupport,
      shipping_type: 0,
      transaction_type: 0,
      note: noteRef.current?.value ? noteRef.current?.value : '',
    };
    if (toggleSupport) {
      form.registration_option = curRegistrationOptions.value;
      form.license_plate_registration_option =
        curLicensePlateRegistrationOption.value;
      form.identification = defaultDocument?.id as number;
    }
    await createOrder(form);
  }, [
    createOrder,
    defaultAddress,
    defaultDocument,
    product,
    toggleSupport,
    noteRef,
    curRegistrationOptions,
    curLicensePlateRegistrationOption,
  ]);
  useEffect(() => {
    if (isLoadingPriceQuoteData || isLoadingOrder) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingPriceQuoteData, isLoadingOrder, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessPriceQuote && priceQuoteData) {
      setPriceQuote(priceQuoteData);
    }

    if (isErrorPriceQuote && errorPriceQuote) {
      const error = errorPriceQuote as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isSuccessPriceQuote,
    priceQuoteData,
    isErrorPriceQuote,
    errorPriceQuote,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isSuccessOrder && orderData) {
      router.replace(`/success-order`);
      deleteCookie('buy_now');
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
    isErrorOrder,
    errorOrder,
    router,
    setVisiblePopup,
  ]);
  return (
    <main className='w-full py-[72px] flex flex-col gap-16'>
      {vehicleRegistrationSupportModal === 'registration_options' && (
        <RegistrationOptionsModal
          cb={() => setVehicleRegistrationSupportModal(null)}
        />
      )}
      {vehicleRegistrationSupportModal ===
        'license_plate_registration_option' && (
        <LicensePlateRegistrationOptionModal
          cb={() => setVehicleRegistrationSupportModal(null)}
        />
      )}
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
          <ProgressMotor step={1} />
        </div>
        {product ? (
          <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <h2 className='text-base md:text-lg flex items-center'>
                    Số điện thoại <span className='sm:block hidden'>:</span>
                  </h2>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    {user && user?.phone_number ? (
                      <p>{user?.phone_number}</p>
                    ) : (
                      <button
                        className='hover:text-blue-500 transition-colors text-sm md:text-base'
                        onClick={() => router.push(`/user/settings/account`)}
                      >
                        Chưa có số điện thoại
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <h2 className='text-base md:text-lg flex items-center'>
                    Địa chỉ <span className='sm:block hidden'>:</span>
                  </h2>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <p>
                      {defaultAddress
                        ? defaultAddress.address_preview
                        : 'Bạn chưa có địa chỉ mặc định nào.'}
                    </p>
                    {defaultAddress ? (
                      <button
                        className='w-max text-sm text-blue-500 font-bold'
                        disabled={isLoadingPriceQuoteData || isLoadingOrder}
                        onClick={() =>
                          setVisibleModal('visibleListAddressModal')
                        }
                      >
                        Thay đổi
                      </button>
                    ) : (
                      <button
                        className='w-max text-sm text-blue-500 font-bold'
                        disabled={isLoadingPriceQuoteData || isLoadingOrder}
                        onClick={() =>
                          setVisibleModal('visibleAddAddressModal')
                        }
                      >
                        Thêm địa chỉ
                      </button>
                    )}
                  </div>
                </div>
                {errors?.errors?.address && (
                  <p className='text-red-500 font-bold text-sm md:text-base'>
                    {errors.errors.address[0]}
                  </p>
                )}
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  Hỗ trợ đăng ký xe
                  <span className='sm:block hidden'>:</span>
                </h2>
                <div>
                  <button
                    className={`relative w-[42px] h-[20px] px-4 py-1 text-sm text-white rounded-3xl flex justify-between items-center font-bold ${
                      toggleSupport ? 'bg-green-500' : 'bg-red-500'
                    } shadow-xl`}
                    onClick={() => setToggleSupport(!toggleSupport)}
                    aria-label='btn-support'
                    disabled={isLoadingPriceQuoteData || isLoadingOrder}
                  >
                    <span
                      className={`absolute bg-neutral-50 h-[20px] w-[20px] rounded-full top-1/2 -translate-y-1/2 ${
                        toggleSupport ? 'left-[52%]' : 'left-0'
                      } transition-all duration-100`}
                    ></span>
                  </button>
                </div>
              </div>
              {toggleSupport && (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                      <h2 className='text-base md:text-lg flex items-center'>
                        Hồ sơ <span className='sm:block hidden'>:</span>
                      </h2>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                        <p>
                          {defaultDocument
                            ? defaultDocument.type_preview
                            : 'Bạn chưa có hồ sơ mặc định nào.'}
                        </p>
                        {defaultDocument ? (
                          <button
                            className='w-max text-sm text-blue-500 font-bold'
                            disabled={isLoadingPriceQuoteData || isLoadingOrder}
                            onClick={() =>
                              setVisibleModal('visibleListDocumentModal')
                            }
                          >
                            Thay đổi
                          </button>
                        ) : (
                          <button
                            className='w-max text-sm text-blue-500 font-bold'
                            disabled={isLoadingPriceQuoteData || isLoadingOrder}
                            onClick={() =>
                              setVisibleModal('visibleAddDocumentModal')
                            }
                          >
                            Thêm hồ sơ
                          </button>
                        )}
                      </div>
                    </div>
                    {errors?.errors?.document && (
                      <p className='text-red-500 font-bold text-sm md:text-base'>
                        {errors.errors.document[0]}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <h2 className='text-base md:text-lg flex items-center'>
                      Tùy chọn trước bạ
                      <span className='sm:block hidden'>:</span>
                    </h2>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm md:text-base'>
                      <p>{curRegistrationOptions.name}</p>
                      <button
                        className='w-max text-sm text-blue-500 font-bold'
                        disabled={isLoadingPriceQuoteData || isLoadingOrder}
                        onClick={() =>
                          setVehicleRegistrationSupportModal(
                            'registration_options'
                          )
                        }
                      >
                        Thay đổi
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-4'>
                      <h2 className='text-base md:text-lg'>
                        Tuỳ chọn Đăng ký biển số
                      </h2>
                      <button
                        className='w-max text-sm text-blue-500 font-bold'
                        disabled={isLoadingPriceQuoteData || isLoadingOrder}
                        onClick={() =>
                          setVehicleRegistrationSupportModal(
                            'license_plate_registration_option'
                          )
                        }
                      >
                        Thay đổi
                      </button>
                    </div>
                    <p className='text-sm md:text-base'>
                      {curLicensePlateRegistrationOption.name}
                    </p>
                  </div>
                </>
              )}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  Loại vận chuyển
                  <span className='sm:block hidden'>:</span>
                </h2>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm md:text-base'>
                  <p>Nhận tại cửa hàng</p>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  Phương thức thanh toán
                  <span className='sm:block hidden'>:</span>
                </h2>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm md:text-base'>
                  <p>Thanh toán tại cửa hàng</p>
                </div>
              </div>
              <div className='w-full flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  Ghi chú
                  <span className='sm:block hidden'>:</span>
                </h2>
                <input
                  className='flex-1 border border-neutral-300 px-4 py-2'
                  type='text'
                  placeholder={`Ghi chú...`}
                  ref={noteRef}
                />
              </div>
            </div>
            <div className='w-full flex justify-end'>
              <button
                className='w-max px-4 py-2 flex items-center gap-2 bg-neutral-800 text-white rounded-sm font-medium'
                disabled={isLoadingPriceQuoteData || isLoadingOrder}
                onClick={handleCheckPrice}
              >
                <TbRefresh className='text-xl' />
                <p>Cập nhật báo giá</p>
              </button>
            </div>
            <div className='w-full rounded-sm border border-neutral-500 overflow-x-auto overflow-y-auto'>
              <table className='w-full h-full whitespace-nowrap'>
                <thead className='font-semibold tracking-wide text-neutral-800 uppercase border-b border-neutral-500'>
                  <tr>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      Sản phẩm
                    </td>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      Giá tiền
                    </td>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      Số lượng
                    </td>
                    <td className='p-4 text-center text-sm md:text-base'>
                      Thành tiền
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr className='w-full text-center font-bold uppercase border-r border-neutral-500'>
                    <td className='p-4 text-start text-sm md:text-base border-r border-neutral-500'>
                      {product?.sku}
                    </td>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      {product?.price?.preview}
                    </td>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      1
                    </td>
                    <td className='p-4 text-center text-sm md:text-base'>
                      {product?.price.preview}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {isSuccessPriceQuote && priceQuote && (
              <div className='flex flex-col gap-4'>
                <h2 className='text-xl md:text-2xl font-bold'>Báo giá</h2>
                <div className='w-full rounded-sm border border-neutral-500 overflow-x-auto overflow-y-auto'>
                  <table className='w-full h-full whitespace-nowrap'>
                    <tbody>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          Phí hỗ trợ đăng ký xe
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {
                            priceQuote?.vehicle_registration_support_fee
                              ?.preview
                          }
                        </td>
                      </tr>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          Lệ phí trước bạ
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.registration_fee?.preview}
                        </td>
                      </tr>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          Lệ phí đăng ký biển số
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.license_plate_registration_fee?.preview}
                        </td>
                      </tr>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          Loại vận chuyển
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.shipping_fee?.preview}
                        </td>
                      </tr>
                      <tr className='font-bold'>
                        <td className='p-4 text-start' colSpan={2}>
                          Tổng tiền
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.total?.preview}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className='w-full flex flex-col md:flex-row justify-between md:items-center gap-4'>
              <p className='text-sm md:text-base'>
                Nhấn &quot;Đặt hàng&quot; đồng nghĩa với việc bạn đồng ý tuân
                theo{' '}
                <button className='text-sm md:text-base text-blue-500'>
                  Điều khoản {title}
                </button>
              </p>
              <button
                className={`px-12 py-2 text-base md:text-lg bg-red-500 text-white font-bold ${
                  isLoadingOrder ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={handleOrder}
                disabled={isLoadingOrder}
              >
                Đặt hàng
              </button>
            </div>
          </div>
        ) : (
          <div className='w-full h-[50vh] flex flex-col justify-center items-center gap-6'>
            <p className='text-md md:text-2xl font-bold'>
              Bạn chưa có sản phẩm cho mình!
            </p>
            <button
              className='px-4 py-2 font-medium bg-neutral-800 text-white'
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

export default withAuth(PurchaseMotorbikePage);
