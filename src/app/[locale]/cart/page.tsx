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
import { useTranslations } from 'next-intl';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import withAuth from '@/components/protected-page/withAuth';
import { UserContext } from '@/contexts/UserProvider';
import CustomImage from '@/components/ui/CustomImage';
import useDebounce from '@/lib/hooks/useDebounce';
import { Cart } from '@/types/types';
import { useFetch } from '@/lib/hooks/useFetch';
import { deleteCart, updateCart } from '@/api/user';
import { PopupContext } from '@/contexts/PopupProvider';
import CustomCheckbox from '@/components/ui/CustomCheckbox';
function CartPage() {
  const t = useTranslations('common');
  const searchParams = useSearchParams();
  const { locale } = useParams();
  const router = useRouter();
  const { cart, isLoadingCart, setCart } = useContext(UserContext);
  const { setVisiblePopup } = useContext(PopupContext);
  const [updateOption, setUpdateOption] = useState<{
    id: number;
    amount: number;
  } | null>(null);
  const [deleteOption, setDeleteOption] = useState<Cart['id'] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const {
    fetchData: updateCartMutation,
    isLoading: isLoadingUpdate,
    isSuccess: isSuccessUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
  } = useFetch(
    async () =>
      await updateCart(
        updateOption?.id as number,
        updateOption?.amount as number
      )
  );
  const {
    fetchData: deleteCartMutation,
    isLoading: isLoadingDelete,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useFetch(async () => await deleteCart(deleteOption as number));

  const handleIncreaseQuantity = useCallback(
    (index: number, option: Cart['id']) => {
      if (cart.length > 0) {
        const newAmount = cart[index].amount + 1;
        setCart((prevCart) =>
          prevCart.map((c, i) =>
            i === index ? { ...c, amount: newAmount } : c
          )
        );
        setUpdateOption({ id: option, amount: newAmount });
      }
    },
    [cart]
  );
  const handleDecreaseQuantity = useCallback(
    (index: number, option: Cart['id']) => {
      if (cart.length > 0) {
        const newAmount = cart[index].amount - 1;
        setCart((prevCart) =>
          prevCart.map((c, i) =>
            i === index
              ? newAmount <= 0
                ? { ...c, amount: 0 }
                : { ...c, amount: newAmount }
              : c
          )
        );
        setUpdateOption({ id: option, amount: newAmount });
      }
    },
    [cart]
  );
  const handleChangeQuantity = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, dataset } = e.target;
      const index = Number(dataset.index!);
      const optionId = Number(dataset.option!);
      const newAmount = Number(value);
      if (cart.length > 0) {
        setCart((prevCart) =>
          prevCart.map((c, i) =>
            i === index
              ? newAmount <= 0
                ? { ...c, amount: 0 }
                : { ...c, amount: newAmount }
              : c
          )
        );
        setUpdateOption({ id: optionId, amount: newAmount });
      }
      return;
    },
    [cart]
  );
  const handleDeleteCart = useCallback((cartId: number) => {
    setDeleteOption(cartId);
  }, []);
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
      `/${locale}/purchase-item?state=${encodeURIComponent(
        JSON.stringify(selectedOptions)
      )}`
    );
  }, [router, locale, selectedOptions]);
  const debouncedAmounts = useDebounce(updateOption, 1000);
  useEffect(() => {
    const itemKey = Number(searchParams.get('itemKey'));
    if (itemKey) {
      setSelectedOptions((prevOptions) => [...prevOptions, itemKey]);
    }
  }, [searchParams.get('itemKey')]);
  useEffect(() => {
    if (debouncedAmounts) {
      updateCartMutation();
    }
  }, [debouncedAmounts]);
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
          message: t('mess_update_cart'),
        },
      });
      setUpdateOption(null);
    }
    if (isErrorUpdate && errorUpdate) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorUpdate?.message,
        },
      });
    }
  }, [isSuccessUpdate, isErrorUpdate, errorUpdate, t, setVisiblePopup]);
  useEffect(() => {
    if (isSuccessDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'success',
          message: t('mess_delete_cart'),
        },
      });
      setCart((prevCart) => prevCart.filter((c) => c.id !== deleteOption));
      setDeleteOption(null);
    }
    if (isErrorDelete && errorDelete) {
      setVisiblePopup({
        visibleToastPopup: {
          type: 'error',
          message: errorDelete?.message,
        },
      });
    }
  }, [isSuccessDelete, isErrorDelete, errorDelete, t, setVisiblePopup]);
  useEffect(() => {
    if (deleteOption) {
      deleteCartMutation();
    }
  }, [deleteOption]);
  const renderedCart = useMemo(() => {
    return cart?.map((c, index) => {
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
                    {t('version')}: {c?.option?.version}
                  </p>
                )}
                {c?.option?.color && (
                  <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                    {t('color')}: {c?.option?.color}
                  </p>
                )}
                {c?.option?.volume && (
                  <p className='text-neutral-500 text-xs md:text-sm font-medium'>
                    {t('volume')}: {c?.option?.volume}
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
                  onClick={() => handleDecreaseQuantity(index, c?.id)}
                  disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
                >
                  -
                </button>
                <input
                  className='px-4 text-center max-w-[64px]'
                  type='number'
                  data-index={index}
                  data-option={c.id}
                  value={cart[index].amount}
                  onChange={handleChangeQuantity}
                  disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
                />
                <button
                  className='h-full px-4 py-2 text-xl border-l border-red-500'
                  onClick={() => handleIncreaseQuantity(index, c?.id)}
                  disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
                >
                  +
                </button>
              </div>
            </div>
          </td>
          <td className='px-2 py-4 text-center'>{t('total')}</td>
          <td className='px-2 py-4 text-center'>
            <button
              aria-label='remove-item'
              className='m-auto w-max hover:text-red-500 transition-colors'
              onClick={() => handleDeleteCart(c.id)}
              disabled={isLoadingCart || isLoadingUpdate || isLoadingDelete}
            >
              <FaRegTrashCan className='text-2xl' />
            </button>
          </td>
        </tr>
      );
    });
  }, [cart, selectedOptions]);
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
          {t('cart')}
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
                    <td className='px-2 py-4 text-start'>{t('product')}</td>
                    <td className='px-2 py-4 text-center'>{t('price')}</td>
                    <td className='px-2 py-4 text-center'>{t('quantity')}</td>
                    <td className='px-2 py-4 text-center'>{t('total')}</td>
                    <td className='px-2 py-4 text-center'>{t('actions')}</td>
                  </tr>
                </thead>
                <tbody className='border-t border-b border-neutral-300'>
                  {renderedCart}
                </tbody>
              </table>
            </div>
            <div className='w-full flex justify-end'>
              <button
                disabled={selectedOptions.length === 0}
                className={`${
                  selectedOptions.length > 0
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed'
                } text-base md:text-lg md:px-6 px-4 py-2 bg-red-600 hover:bg-red-500 transition-colors text-white font-semibold rounded-sm`}
                onClick={handlePurchase}
              >
                {t('purchase')}
              </button>
            </div>
          </div>
        )}
        {cart?.length === 0 && !isLoadingCart && (
          <div className='flex flex-col items-center gap-6'>
            <div className='border border-neutral-300 w-full px-4 py-8 flex justify-center items-center'>
              <p className='font-bold text-neutral-800 text-base sm:text-lg md:text-xl text-center'>
                {t('empty_cart')}
              </p>
            </div>
            <button
              className='w-max bg-red-600 rounded-sm text-white hover:bg-neutral-800 transition-colors px-4 py-4 text-sm font-bold uppercase'
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

export default withAuth(CartPage);
