'use client';
import Image from 'next/image';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Cart } from '@/types/types';
import { UserContext } from '@/contexts/UserProvider';
import Table from '@/components/ui/Table';
import CustomImage from '@/components/ui/CustomImage';
import { FaLocationDot } from 'react-icons/fa6';
import { ModalContext } from '@/contexts/ModalProvider';
import { purchaseItem } from '@/api/product';
import { PopupContext } from '@/contexts/PopupProvider';
function PurchaseItemLayout() {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const { user, cart, defaultAddress, refetchCart } = useContext(UserContext);
  const [items, setItems] = useState<Cart[]>([]);
  const { setVisibleModal } = useContext(ModalContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const noteRef = useRef<HTMLInputElement | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [errorOrder, setErrorOrder] = useState<any>(null);
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
    setIsLoadingOrder(true);
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
    const res = await purchaseItem(form);
    if (res.type === 'success') {
      await refetchCart();
      setErrorOrder(null);
      router.replace(`/${locale}/success-order`);
    }
    if (res.type === 'error') {
      setErrorOrder(res.data);
    }
    setIsLoadingOrder(false);
  }, [defaultAddress, items, noteRef]);
  useEffect(() => {
    if (isLoadingOrder) {
      setVisiblePopup({ visibleLoadingPopup: true });
    } else {
      setVisiblePopup({ visibleLoadingPopup: false });
    }
  }, [isLoadingOrder]);
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
          {t('order')}
        </h1>
      </section>
      <section className='container m-auto px-4 flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <div className='text-red-500 flex items-center gap-4'>
            <FaLocationDot className='text-xl md:text-2xl' />
            <h1 className='text-xl md:text-3xl'>{t('address')}</h1>
          </div>
          <div className='flex flex-col gap-4'>
            <div>
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 font-bold text-base md:text-lg'>
                <p>{user?.name}</p>
                {user?.phone_number ? (
                  <p>{user?.phone_number}</p>
                ) : (
                  <button
                    className='text-blue-500 hover:text-blue-600 transition-colors text-xs md:text-sm'
                    onClick={() =>
                      router.push(`/${locale}/user/settings/account`)
                    }
                    disabled={isLoadingOrder}
                  >
                    {t('mess_no_phone')}
                  </button>
                )}
              </div>
            </div>
            {defaultAddress ? (
              <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm md:text-base'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
                  <p>{defaultAddress?.address_preview}</p>
                  {defaultAddress?.default && (
                    <p className='w-max px-1 border border-red-500 text-red-500 text-xs md:text-sm'>
                      {t('default')}
                    </p>
                  )}
                </div>
                <button
                  className='w-max text-xs md:text-sm text-blue-500 hover:text-blue-600 transition-colors'
                  onClick={() => setVisibleModal('visibleListAddressModal')}
                  disabled={isLoadingOrder}
                >
                  {t('change')}
                </button>
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-4'>
                  <p>{t('mess_no_address_default')}</p>
                  <button
                    className='w-max text-blue-500 font-bold text-xs md:text-sm'
                    onClick={() => setVisibleModal('visibleAddAddressModal')}
                    disabled={isLoadingOrder}
                  >
                    {t('add_address')}
                  </button>
                </div>
                {errorOrder?.errors?.address && (
                  <p className='text-red-500 font-bold text-sm md:text-base'>
                    {errorOrder.errors.address[0]}
                  </p>
                )}
              </div>
            )}
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
        <Table
          tHeader={[t('product'), t('price'), t('quantity'), t('total')]}
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
                          {t('version')}: {i?.option?.version}
                        </p>
                      )}
                      {i?.option?.color && (
                        <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                          {t('color')}: {i?.option?.color}
                        </p>
                      )}
                      {i?.option?.volume && (
                        <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                          {t('volume')}: {i?.option?.volume}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className='px-2 py-4 text-center'>
                  {i?.option?.price?.preview}
                </td>
                <td className='px-2 py-4 text-center'>{i?.amount}</td>
                <td className='px-2 py-4 text-center'>{t('total')}</td>
              </tr>
            );
          })}
        />
        <div className='w-full flex justify-end items-center gap-4'>
          <button className='text-sm md:text-base text-neutral-500 font-medium hover:text-neutral-800 transition-colors'>
            {t('mess_alert_place_order', {
              terms_and_services: t('terms_and_services'),
              web_name: process.env.NEXT_PUBLIC_WEBSITE_NAME,
            })}
          </button>
          <button
            className='px-4 py-2 text-base md:text-lg bg-red-500 text-white font-bold'
            onClick={handleOrder}
            disabled={isLoadingOrder}
          >
            {t('order')}
          </button>
        </div>
      </section>
    </main>
  );
}

export default PurchaseItemLayout;
