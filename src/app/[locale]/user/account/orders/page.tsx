'use client';
import { getOrders } from '@/api/user';
import Table from '@/components/ui/Table';
import { statusOrder } from '@/config/config';
import { useFetch } from '@/lib/hooks/useFetch';
import useQueryString from '@/lib/hooks/useQueryString';
import withAuth from '@/components/protected-page/withAuth';
import { Order } from '@/types/types';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import { FaRegEye } from 'react-icons/fa6';

function OrdersPage() {
  const t = useTranslations('common');
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const {
    fetchData: fetchOrders,
    isLoading: isLoadingOrders,
    data: ordersData,
    isSuccess: isSuccessOrders,
  } = useFetch(async () => await getOrders(searchParams.toString()));
  const [createQueryString, _, deleteQueryString] = useQueryString();
  useEffect(() => {
    fetchOrders();
  }, [searchParams]);
  const renderedStatusOrder = useMemo(() => {
    return statusOrder?.map((s) => {
      return (
        <option key={s.value} value={s.value}>
          {t(s.name)}
        </option>
      );
    });
  }, [statusOrder, t]);
  const renderedOrder = useMemo(() => {
    return (
      isSuccessOrders &&
      ordersData?.data?.map((o: Order) => {
        const curOrder = statusOrder.findIndex((s) => t(s.name) === o.status);
        return (
          <tr className='border-b border-neutral-300' key={o.id}>
            <td className='p-4 text-center'>{o?.id}</td>
            <td className='p-4 text-center'>{o?.updated_at}</td>
            <td className='p-4 text-center'>
              <p
                className='text-sm px-2 rounded-[26px]'
                style={{
                  color: statusOrder[curOrder].color,
                  border: `1px solid ${statusOrder[curOrder].color}`,
                }}
              >
                {t(statusOrder[curOrder].name)}
              </p>
            </td>
            <td className='p-4 text-center'>{o?.total?.preview}</td>
            <td className='p-4 text-center'>
              <button
                className='w-max'
                aria-label='view-details-order'
                title={t('see_details')}
                onClick={() =>
                  router.push(`/${locale}/user/account/orders/${o.id}`)
                }
              >
                <FaRegEye className='text-2xl hover:text-green-500 transition-colors' />
              </button>
            </td>
          </tr>
        );
      })
    );
  }, [isSuccessOrders, ordersData, statusOrder, router, locale, t]);
  return (
    <div className='w-full h-full flex flex-col gap-6'>
      <section className='pb-4 border-b border-neutral-300 flex flex-col sm:flex-row gap-4 justify-between sm:items-center'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>
          {t('purchase_order')}
        </h1>
        <select
          name='status'
          id='status'
          className='w-full sm:w-max border border-neutral-500 px-4 py-2'
          onChange={(e) => {
            if (e.target.value) {
              createQueryString('status', e.target.value);
            } else {
              deleteQueryString();
            }
          }}
        >
          <option value=''>{t('all')}</option>
          {renderedStatusOrder}
        </select>
      </section>
      <section>
        {!isLoadingOrders && (
          <Table
            tHeader={[
              t('order_code'),
              t('last_updated_at'),
              t('status'),
              t('total'),
              t('actions'),
            ]}
            renderedData={renderedOrder}
            totalPage={ordersData?.totalPage}
          />
        )}
        {isLoadingOrders && <div className='w-full h-screen skeleton'></div>}
      </section>
    </div>
  );
}

export default withAuth(OrdersPage);
