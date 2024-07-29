'use client';
import Image from 'next/image';
import React, { useContext } from 'react';
import bgImg from '@/assets/port-title-area.jpg';
import { useTranslations } from 'next-intl';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useParams, useRouter } from 'next/navigation';
import withAuth from '@/protected-page/withAuth';
import { FetchDataContext } from '@/contexts/FetchDataProvider';
import CustomImage from '@/components/ui/CustomImage';

function WishlistPage() {
  const t = useTranslations('common');
  const { locale } = useParams();
  const router = useRouter();
  const { wishlist, isLoadingWishlist } = useContext(FetchDataContext);
  return (
    <main className='w-full py-[72px] flex flex-col gap-16'>
      <section className='absolute h-[280px] w-full -z-10 hidden lg:block'>
        <Image
          className='w-full h-full object-cover'
          src={bgImg}
          alt='bg-img'
          fetchPriority='high'
        />
      </section>
      <section className='lg:container m-auto py-8 w-full h-auto lg:h-[280px] flex flex-col justify-center items-center gap-4 lg:items-start bg-neutral-800 lg:bg-transparent'>
        <h1 className='text-center md:text-start text-2xl sm:text-4xl md:text-[70px] md:leading-[70px] font-bold text-white lg:text-neutral-800 tracking-[4px]'>
          {t('wishlist')}
        </h1>
      </section>
      {!isLoadingWishlist && (
        <section className='container m-auto px-4'>
          {wishlist.length > 0 ? (
            <div className='w-full overflow-x-auto text-sm md:text-base'>
              <table className='w-full whitespace-nowrap'>
                <thead>
                  <tr className='uppercase font-bold tracking-wide'>
                    <td className='px-2 py-4 text-center'>{t('product')}</td>
                    <td className='px-2 py-4 text-center'>{t('color')}</td>
                    <td className='px-2 py-4 text-center'>{t('created_at')}</td>
                    <td className='px-2 py-4 text-center'>{t('actions')}</td>
                  </tr>
                </thead>
                <tbody className='border-t border-b border-neutral-300'>
                  {wishlist?.map((w) => {
                    return (
                      <tr key={w.id}>
                        <td className='px-2 py-4'>
                          <div
                            className='flex justify-center items-center gap-2 overflow-hidden cursor-pointer'
                            onClick={() =>
                              router.push(
                                `/${locale}/products/${w.product_preview.id}`
                              )
                            }
                          >
                            <div className='w-[96px] h-[96px]'>
                              <CustomImage
                                image={w.product_preview?.images[0]}
                                width={96}
                                height={96}
                              />
                            </div>
                            <p title={w.product_preview.name}>
                              {w.product_preview?.name}
                            </p>
                          </div>
                        </td>
                        <td className='px-2 py-4 text-center'>
                          {w.product_preview.color}
                        </td>
                        <td className='px-2 py-4 text-center'>
                          {w.created_at}
                        </td>
                        <td className='px-2 py-4'>
                          <div className='w-full flex justify-center gap-4'>
                            <button
                              className='hover:text-red-500 transition-colors'
                              aria-label='delete-cart'
                              // onClick={() => dispatch(removeCart(null))}
                            >
                              <FaRegTrashCan className='text-xl' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-6'>
              <div className='border border-neutral-300 w-full px-4 py-8 flex justify-center items-center'>
                <p className='font-bold text-neutral-800 text-base sm:text-lg md:text-xl'>
                  {t('empty_wishlist')}
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
      )}
      {isLoadingWishlist && (
        <section className='container m-auto px-4 h-[30vh] w-full skeleton'></section>
      )}
    </main>
  );
}

export default withAuth(WishlistPage);
