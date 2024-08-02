import React, { useMemo } from 'react';
import { SingleProduct } from '@/components/ui/SingleProduct';
import { Product } from '@/types/types';
import CustomPaginationV2 from '@/components/ui/CustomPaginationV2';
import { useParams, useRouter } from 'next/navigation';
type Props = {
  products: Product[];
  total_pages: string | number;
};
function ProductsSection({ products, total_pages }: Props) {
  const router = useRouter();
  const { locale } = useParams();
  const renderedProducts = useMemo(() => {
    return products?.map((p: Product) => {
      return (
        <SingleProduct
          articleClass='m-auto md:m-0 w-full max-w-[180px] md:max-w-[250px] cursor-pointer flex flex-col gap-2'
          key={p?.id}
          product={p}
        >
          <SingleProduct.Image customClass='h-[150px] md:h-[180px]' />
          <div
            className='flex flex-col gap-2'
            onClick={() => router.push(`/${locale}/products/${p.id}`)}
          >
            <div className='flex flex-col gap-1 font-bold'>
              <SingleProduct.Category />
              <SingleProduct.Rate />
              <SingleProduct.Title />
              <SingleProduct.Price />
            </div>
          </div>
        </SingleProduct>
      );
    });
  }, [products, router, locale]);
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='w-full flex flex-wrap justify-between gap-x-4 gap-y-8'>
        {renderedProducts}
      </div>
      {Number(total_pages) > 1 && <div className='w-full'></div>}
      {Number(total_pages) > 1 && (
        <CustomPaginationV2 scroll={true} totalPage={Number(total_pages)} />
      )}
    </div>
  );
}

export default ProductsSection;
