'use client';
import { getOrderDetails } from '@/api/user';
import CustomImage from '@/components/ui/CustomImage';
import { statusOrder } from '@/config/config';
import { ModalContext } from '@/contexts/ModalProvider';
import { useFetch } from '@/lib/hooks/useFetch';
import withAuth from '@/components/protected-page/withAuth';
import { Order } from '@/types/types';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useState } from 'react';

function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const { setVisibleModal } = useContext(ModalContext);
  const {
    fetchData: fetchOrder,
    data: orderData,
    isLoading: isLoadingOrder,
    isSuccess: isSuccessOrder,
    isError: isErrorOrder,
  } = useFetch(async () => await getOrderDetails(id as string));
  const curStatus = useMemo(() => {
    if (isSuccessOrder && orderData) {
      return statusOrder.find((o) => o.name === orderData?.status);
    }
    return null;
  }, [isSuccessOrder, orderData, statusOrder]);
  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);
  useEffect(() => {
    if (isSuccessOrder && orderData) {
      setOrder(orderData);
    }
  }, [isSuccessOrder, orderData]);
  if (isErrorOrder) return notFound();
  return (
    <div className='flex flex-col gap-6 text-sm md:text-base'>
      <section className='pb-4 border-b border-neutral-400 flex flex-col sm:flex-row gap-4 justify-between sm:items-center'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>
          Chi tiết đơn hàng
        </h1>
        {order && curStatus && curStatus?.value === 3 && (
          <button
            className='border border-neutral-300 bg-neutral-800 text-white px-6 py-2'
            onClick={() =>
              setVisibleModal({
                visibleReviewsModal: order?.invoice_products[0].option,
              })
            }
          >
            Đánh giá
          </button>
        )}
        {/* <p className='text-green-500 text-sm md:text-base font-bold flex items-center gap-2'>
          <GiCheckMark className='text-lg' />
          <span>Sản phẩm đã được đánh giá</span>
        </p> */}
      </section>
      {!isLoadingOrder && order && (
        <section className='flex flex-col gap-4'>
          <div className='pb-4 flex flex-col gap-2'>
            {curStatus && (
              <h2
                className='text-lg md:text-xl font-bold'
                style={{ color: curStatus.color }}
              >
                {curStatus.name}
              </h2>
            )}
            <p>{order.updated_at}</p>
          </div>
          <div className='w-full py-4 border-b border-t border-neutral-400 flex items-center gap-6'>
            <div className='hidden sm:block size-[128px] overflow-hidden rounded-sm'>
              <CustomImage
                className='w-full h-full object-cover'
                width={128}
                height={128}
                image={order?.invoice_products[0]?.option?.images[0]}
              />
            </div>
            <div className='flex-1 flex flex-col gap-2 text-xs md:text-sm text-neutral-500'>
              <button
                className='w-max text-start line-clamp-1 hover:underline transition-all duration-100 text-sm md:text-base text-neutral-800'
                onClick={() =>
                  router.push(
                    `/products/${order?.invoice_products[0]?.option?.product_id}`
                  )
                }
              >
                {order?.invoice_products[0]?.option?.product?.name}
              </button>
              <p>Phiên bản: {order?.invoice_products[0]?.option?.version}</p>
              <p>Màu sắc: {order?.invoice_products[0]?.option?.color}</p>
              <div className='flex justify-between'>
                <p>x{order?.invoice_products[0].amount}</p>
                <p className='text-neutral-800 text-sm md:text-base'>
                  {order?.invoice_products[0]?.option?.price?.preview}
                </p>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-col gap-6'>
            {order?.identification && (
              <p>
                <span className='font-bold'>Loại hồ sơ</span>:{' '}
                {order?.identification?.type_preview}
              </p>
            )}
            <p>
              <span className='font-bold'>Địa chỉ</span>:{' '}
              {order?.address?.address_preview}
            </p>
            <div className='flex flex-col gap-4'>
              <p className='font-bold'>
                Hỗ trợ đăng ký xe:{' '}
                {order?.other_fields?.vehicle_registration_support
                  ? 'Có'
                  : 'Không'}
              </p>
              <div className='w-full rounded-sm border border-neutral-500 overflow-x-auto overflow-y-auto'>
                <table className='w-full h-full whitespace-nowrap'>
                  <tbody>
                    <tr className='border border-neutral-400'>
                      <td
                        className='p-4 border-r border-neutral-400 font-bold'
                        colSpan={1}
                      >
                        Phí hỗ trợ đăng ký xe
                      </td>
                      <td className='text-end p-4' colSpan={2}>
                        {
                          order?.other_fees?.vehicle_registration_support_fee
                            ?.preview
                        }
                      </td>
                    </tr>
                    {order?.other_fields?.vehicle_registration_support && (
                      <tr className='border border-neutral-400'>
                        <td className='p-4 font-bold' colSpan={1}>
                          Tùy chọn trước bạ
                        </td>
                        <td
                          className='p-4 flex justify-center items-center border-l border-r border-neutral-400'
                          colSpan={1}
                        >
                          <p
                            title={order?.other_fields?.registration_option}
                            className='max-w-[220px] truncate'
                          >
                            {order?.other_fields?.registration_option}
                          </p>
                        </td>
                        <td className='text-end p-4' colSpan={1}>
                          {order?.other_fees?.registration_fee?.preview}
                        </td>
                      </tr>
                    )}
                    {order?.other_fields?.vehicle_registration_support && (
                      <tr className='border border-neutral-400'>
                        <td className='p-4 font-bold' colSpan={1}>
                          Tuỳ chọn Đăng ký biển số
                        </td>
                        <td
                          className='p-4 flex justify-center items-center border-l border-r border-neutral-400'
                          colSpan={1}
                        >
                          <p
                            title={
                              order?.other_fields
                                ?.license_plate_registration_option
                            }
                            className='max-w-[220px] truncate'
                          >
                            {
                              order?.other_fields
                                ?.license_plate_registration_option
                            }
                          </p>
                        </td>
                        <td className='text-end p-4' colSpan={1}>
                          {
                            order?.other_fees?.license_plate_registration_fee
                              ?.preview
                          }
                        </td>
                      </tr>
                    )}
                    <tr className='border border-neutral-400'>
                      <td
                        className='p-4 border-r border-neutral-400 font-bold'
                        colSpan={1}
                      >
                        Phương thức thanh toán
                      </td>
                      <td className='text-end p-4' colSpan={2}>
                        {order?.transaction_type}
                      </td>
                    </tr>
                    <tr className='border border-neutral-400'>
                      <td className='p-4 font-bold' colSpan={1}>
                        Loại vận chuyển
                      </td>
                      <td
                        className='p-4 flex justify-center items-center border-l border-r border-neutral-400'
                        colSpan={1}
                      >
                        <p
                          title={order?.shipping_type}
                          className='max-w-[220px] truncate'
                        >
                          {order?.shipping_type}
                        </p>
                      </td>
                      <td className='text-end p-4' colSpan={1}>
                        {order?.shipping_fee?.preview}
                      </td>
                    </tr>
                    <tr className='border border-neutral-400'>
                      <td
                        className='p-4 border-r border-neutral-400 font-bold'
                        colSpan={1}
                      >
                        Tổng tiền
                      </td>
                      <td className='text-end p-4' colSpan={2}>
                        {order?.total?.preview}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
      {isLoadingOrder && <div className='w-full h-screen skeleton'></div>}
    </div>
  );
}

export default withAuth(OrderDetailsPage);
