'use client';
import withAuth from '@/protected-page/withAuth';
import React, {
  use,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { UserContext } from '@/contexts/UserProvider';
import { TbRefresh } from 'react-icons/tb';
import { PopupContext } from '@/contexts/PopupProvider';
import { Address, Document, ProductOption } from '@/types/types';
import { usePostPriceQuoteMutation } from '@/lib/redux/query/adminQuery';
import { ModalContext } from '@/contexts/ModalProvider';
import { deleteCookie, getCookie } from 'cookies-next';
import { useParams, useRouter } from 'next/navigation';
import { VehicleRegistrationSupportContext } from './_contexts/VehicleRegistrationSupportProvider';
import RegistrationOptionsModal from './_components/RegistrationOptionsModal';
import LicensePlateRegistrationOptionModal from './_components/LicensePlateRegistrationOptionModal';
import { purchaseMotorbike } from '@/api/product';
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
  const { locale } = useParams();
  const router = useRouter();
  const t = useTranslations('common');
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
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [errorOrder, setErrorOrder] = useState<any>(null);
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
    setIsLoadingOrder(true);
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
    const res = await purchaseMotorbike(form);
    if (res.type === 'success') {
      setErrorOrder(null);
      router.replace(`/${locale}/success-order`);
      deleteCookie('buy_now');
    }
    if (res.type === 'error') {
      setErrorOrder(res.data);
    }
    setIsLoadingOrder(false);
  }, [
    defaultAddress,
    defaultDocument,
    product,
    toggleSupport,
    noteRef,
    curRegistrationOptions,
    curLicensePlateRegistrationOption,
    router,
  ]);
  useEffect(() => {
    if (isLoadingPriceQuoteData) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
    if (!isLoadingPriceQuoteData && isSuccessPriceQuote && priceQuoteData) {
      setPriceQuote(priceQuoteData);
    }

    if (!isLoadingPriceQuoteData && isErrorPriceQuote && errorPriceQuote) {
      const error = errorPriceQuote as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isLoadingPriceQuoteData,
    isSuccessPriceQuote,
    priceQuoteData,
    isErrorPriceQuote,
    errorPriceQuote,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isLoadingPriceQuoteData) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
    if (!isLoadingPriceQuoteData && isSuccessPriceQuote && priceQuoteData) {
      setPriceQuote(priceQuoteData);
    }

    if (!isLoadingPriceQuoteData && isErrorPriceQuote && errorPriceQuote) {
      const error = errorPriceQuote as any;
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: error?.data?.message,
        },
      });
    }
  }, [
    isLoadingPriceQuoteData,
    isSuccessPriceQuote,
    priceQuoteData,
    isErrorPriceQuote,
    errorPriceQuote,
    setVisiblePopup,
  ]);
  useEffect(() => {
    if (isLoadingOrder) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
    if (!isLoadingOrder && errorOrder) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorOrder?.message,
        },
      });
    }
  }, [isLoadingOrder, errorOrder, setVisiblePopup, router]);
  return (
    <main className='container m-auto px-4 w-full py-[72px] flex flex-col gap-16'>
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
      <section className='py-16 flex flex-col gap-6'>
        <h1 className='text-3xl text-red-500 font-bold'>
          {t('purchase_order')}
        </h1>
        {product ? (
          <div className='flex flex-col gap-12'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <h2 className='text-base md:text-lg flex items-center'>
                    {t('phone')} <span className='sm:block hidden'>:</span>
                  </h2>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    {user && user?.phone_number ? (
                      <p>{user?.phone_number}</p>
                    ) : (
                      <button
                        className='hover:text-blue-500 transition-colors'
                        onClick={() =>
                          router.push(`/${locale}/user/settings/account`)
                        }
                      >
                        {t('mess_no_phone')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  <h2 className='text-base md:text-lg flex items-center'>
                    {t('address')} <span className='sm:block hidden'>:</span>
                  </h2>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <p>
                      {defaultAddress
                        ? defaultAddress.address_preview
                        : t('mess_no_address_default')}
                    </p>
                    {defaultAddress ? (
                      <button
                        className='w-max text-sm text-blue-500 font-bold'
                        disabled={isLoadingPriceQuoteData || isLoadingOrder}
                        onClick={() =>
                          setVisibleModal('visibleListAddressModal')
                        }
                      >
                        {t('change')}
                      </button>
                    ) : (
                      <button
                        className='w-max text-sm text-blue-500 font-bold'
                        disabled={isLoadingPriceQuoteData || isLoadingOrder}
                        onClick={() =>
                          setVisibleModal('visibleAddAddressModal')
                        }
                      >
                        {t('add_address')}
                      </button>
                    )}
                  </div>
                </div>
                {errorOrder?.errors?.address && (
                  <p className='text-red-500 font-bold text-sm md:text-base'>
                    {errorOrder.errors.address[0]}
                  </p>
                )}
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  {t('vehicle_registration_support')}
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
                        {t('documents')}{' '}
                        <span className='sm:block hidden'>:</span>
                      </h2>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                        <p>
                          {defaultDocument
                            ? defaultDocument.type_preview
                            : t('mess_no_document_default')}
                        </p>
                        {defaultDocument ? (
                          <button
                            className='w-max text-sm text-blue-500 font-bold'
                            disabled={isLoadingPriceQuoteData || isLoadingOrder}
                            onClick={() =>
                              setVisibleModal('visibleListDocumentModal')
                            }
                          >
                            {t('change')}
                          </button>
                        ) : (
                          <button
                            className='w-max text-sm text-blue-500 font-bold'
                            disabled={isLoadingPriceQuoteData || isLoadingOrder}
                            onClick={() =>
                              setVisibleModal('visibleAddDocumentModal')
                            }
                          >
                            {t('add_document')}
                          </button>
                        )}
                      </div>
                    </div>
                    {errorOrder?.errors?.document && (
                      <p className='text-red-500 font-bold text-sm md:text-base'>
                        {errorOrder.errors.document[0]}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                    <h2 className='text-base md:text-lg flex items-center'>
                      {t('registration_options')}
                      <span className='sm:block hidden'>:</span>
                    </h2>
                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm md:text-base'>
                      <p>{t(curRegistrationOptions.name)}</p>
                      <button
                        className='w-max text-sm text-blue-500 font-bold'
                        disabled={isLoadingPriceQuoteData || isLoadingOrder}
                        onClick={() =>
                          setVehicleRegistrationSupportModal(
                            'registration_options'
                          )
                        }
                      >
                        {t('change')}
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-4'>
                      <h2 className='text-base md:text-lg'>
                        {t('license_plate_registration_option')}
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
                        {t('change')}
                      </button>
                    </div>
                    <p className='text-sm md:text-base'>
                      {t(curLicensePlateRegistrationOption.name)}
                    </p>
                  </div>
                </>
              )}
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  {t('shipping_type')}
                  <span className='sm:block hidden'>:</span>
                </h2>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm md:text-base'>
                  <p>{t('pick_up_in_store')}</p>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  {t('payment_methods')}
                  <span className='sm:block hidden'>:</span>
                </h2>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 text-sm md:text-base'>
                  <p>{t('pay_at_the_store')}</p>
                </div>
              </div>
              <div className='w-full flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  {t('note')}
                  <span className='sm:block hidden'>:</span>
                </h2>
                <input
                  className='flex-1 border border-neutral-300 px-4 py-2'
                  type='text'
                  placeholder={`${t('note')}...`}
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
                <p>{t('update_the_quotation')}</p>
              </button>
            </div>
            <div className='w-full rounded-sm border border-neutral-500 overflow-x-auto overflow-y-auto'>
              <table className='w-full h-full whitespace-nowrap'>
                <thead className='font-semibold tracking-wide text-neutral-800 uppercase border-b border-neutral-500'>
                  <tr>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      {t('product')}
                    </td>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      {t('price')}
                    </td>
                    <td className='p-4 text-center text-sm md:text-base border-r border-neutral-500'>
                      {t('quantity')}
                    </td>
                    <td className='p-4 text-center text-sm md:text-base'>
                      {t('total')}
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
                <h2 className='text-xl md:text-2xl font-bold'>{t('quote')}</h2>
                <div className='w-full rounded-sm border border-neutral-500 overflow-x-auto overflow-y-auto'>
                  <table className='w-full h-full whitespace-nowrap'>
                    <tbody>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          {t('vehicle_registration_support_fee')}
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
                          {t('registration_fee')}
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.registration_fee?.preview}
                        </td>
                      </tr>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          {t('license_plate_registration_fee')}
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.license_plate_registration_fee?.preview}
                        </td>
                      </tr>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          {t('tax')}
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.tax?.preview}
                        </td>
                      </tr>
                      <tr className='font-bold border-b border-neutral-500'>
                        <td className='p-4 text-start' colSpan={2}>
                          {t('shipping_type')}
                        </td>
                        <td className='p-4 text-end' colSpan={2}>
                          {priceQuote?.shipping_fee?.preview}
                        </td>
                      </tr>
                      <tr className='font-bold'>
                        <td className='p-4 text-start' colSpan={2}>
                          {t('total')}
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
            <div className='w-full flex justify-end items-center gap-4'>
              <button
                className='text-sm md:text-base text-neutral-500 font-medium hover:text-neutral-800 transition-colors'
                disabled={isLoadingPriceQuoteData || isLoadingOrder}
              >
                {t('mess_alert_place_order', {
                  terms_and_services: t('terms_and_services'),
                  web_name: process.env.NEXT_PUBLIC_WEBSITE_NAME,
                })}
              </button>
              <button
                className='px-4 py-2 text-base md:text-lg bg-red-500 text-white font-bold'
                onClick={handleOrder}
                disabled={isLoadingPriceQuoteData || isLoadingOrder}
              >
                {t('purchase')}
              </button>
            </div>
          </div>
        ) : (
          <div className='w-full h-[50vh] flex flex-col justify-center items-center gap-6'>
            <p className='text-md md:text-2xl font-bold'>
              {t('mess_no_cur_order')}
            </p>
            <button
              className='px-4 py-2 font-medium bg-neutral-800 text-white'
              onClick={() => router.push(`/${locale}/products`)}
            >
              {t('return_shop')}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default withAuth(PurchaseMotorbikePage);
