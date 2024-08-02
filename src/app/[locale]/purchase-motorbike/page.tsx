'use client';
import withAuth from '@/protected-page/withAuth';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { userCurMotorbike } from '@/lib/redux/slice/userSlice';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import { TbRefresh } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { PopupContext } from '@/contexts/PopupProvider';
import { Address, Document, ProductOption } from '@/types/types';
import { usePostPriceQuoteMutation } from '@/lib/redux/query/priceQuoteQuery';
type Form = {
  address: Address['id'] | null;
  identification: Document['id'] | null;
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
  note: string;
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
  const t = useTranslations('common');
  const { setVisiblePopup } = useContext(PopupContext);
  const { defaultAddress, defaultDocument } = useContext(FetchDataContext);
  const [toggleSupport, setToggleSupport] = useState(false);
  const product = useSelector(userCurMotorbike);
  const [priceQuote, setPriceQuote] = useState<PriceQuote | null>(null);
  console.log(priceQuote);
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
  const errors = useMemo(() => {
    if (isErrorPriceQuote && errorPriceQuote) {
      const error = errorPriceQuote as any;
      return {
        errors: error?.data?.errors,
        message: error?.data?.message,
      };
    }
    return null;
  }, [isErrorPriceQuote, errorPriceQuote]);
  const handleCheckPrice = useCallback(async () => {
    const form: Form = {
      address: defaultAddress?.id as number,
      identification: defaultDocument?.id as number,
      invoice_products: [
        {
          option: product?.id as number,
          amount: 1,
        },
      ],
      vehicle_registration_support: toggleSupport,

      shipping_type: 0,
      transaction_type: 0,
      note: '1',
    };
    if (toggleSupport) {
      form.registration_option = 0;
      form.license_plate_registration_option = 0;
    }
    await postPriceQuote(form);
  }, [postPriceQuote, product, defaultAddress, defaultDocument, toggleSupport]);
  useEffect(() => {
    if (isLoadingPriceQuoteData) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
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
    isLoadingPriceQuoteData,
    isSuccessPriceQuote,
    priceQuoteData,
    isErrorPriceQuote,
    errorPriceQuote,
    setVisiblePopup,
  ]);
  return (
    <main className='container m-auto px-4 w-full py-[72px] flex flex-col gap-16'>
      <section className='py-16 flex flex-col gap-6'>
        <h1 className='text-3xl text-red-500 font-bold'>
          {t('purchase_order')}
        </h1>
        {product ? (
          <>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                <h2 className='text-base md:text-lg flex items-center'>
                  {t('documents')} <span className='sm:block hidden'>:</span>
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
                      disabled={isLoadingPriceQuoteData}
                    >
                      {t('change')}
                    </button>
                  ) : (
                    <button
                      className='w-max text-sm text-blue-500 font-bold'
                      disabled={isLoadingPriceQuoteData}
                    >
                      {t('add_document')}
                    </button>
                  )}
                </div>
              </div>
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
                      disabled={isLoadingPriceQuoteData}
                    >
                      {t('change')}
                    </button>
                  ) : (
                    <button
                      className='w-max text-sm text-blue-500 font-bold'
                      disabled={isLoadingPriceQuoteData}
                    >
                      {t('add_address')}
                    </button>
                  )}
                </div>
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
                    disabled={isLoadingPriceQuoteData}
                  >
                    <span
                      className={`absolute bg-neutral-50 h-[20px] w-[20px] rounded-full top-1/2 -translate-y-1/2 ${
                        toggleSupport ? 'left-[52%]' : 'left-0'
                      } transition-all duration-100`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
            <div className='w-full flex justify-end'>
              <button
                className='w-max px-4 py-2 flex items-center gap-2 bg-neutral-800 text-white rounded-sm font-medium'
                disabled={isLoadingPriceQuoteData}
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
                  <tr className='border-t border-neutral-500 font-bold'>
                    <td className='p-4 text-start' colSpan={2}>
                      Phí trước bạ
                    </td>
                    <td className='p-4 text-end' colSpan={2}>
                      4000000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className='w-full h-[50vh] flex flex-col justify-center items-center gap-6'>
            <p className='text-md md:text-2xl font-bold'>
              {t('mess_no_cur_order')}
            </p>
            <button
              className='px-4 py-2 font-medium bg-neutral-800 text-white'
              onClick={() => router.push('/')}
            >
              {t('back-home')}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default withAuth(PurchaseMotorbikePage);
