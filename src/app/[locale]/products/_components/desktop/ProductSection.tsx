import React, { useMemo } from 'react';
import { SingleProduct } from '@/components/ui/SingleProduct';
import CustomPagination from '@/components/ui/CustomPagination';
import { Product } from '@/types/types';
type Props = {
  products: Product[];
  total_pages: string | number;
  current_page: string | number;
};
function ProductsSection({ products, total_pages, current_page }: Props) {
  const renderedProducts = useMemo(() => {
    return products?.map((p: Product) => {
      return (
        <SingleProduct
          articleClass='col-span-1 m-auto md:m-0 w-full max-w-[280px] cursor-pointer flex flex-col gap-2'
          key={p?.id}
          product={p}
        >
          <SingleProduct.Image customClass='h-[250px]' />
          <div className='flex flex-col gap-2'>
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
  }, [products]);
  return (
    <div className='w-full flex flex-col items-center gap-16'>
      <div className='w-full grid grid-cols-4 gap-x-4 gap-y-16'>
        {renderedProducts}
      </div>
      {Number(total_pages) > 1 && (
        <CustomPagination
          curPage={Number(current_page)}
          totalPage={Number(total_pages)}
        />
      )}
    </div>
  );
}

export default ProductsSection;
