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
          articleClass='m-auto md:m-0 w-full max-w-[300px] cursor-pointer flex flex-col gap-2'
          key={p.id}
          product={p}
        >
          <SingleProduct.Image />
          <SingleProduct.Type />
          <div className='flex flex-col gap-1 font-bold'>
            <SingleProduct.Title />
            <SingleProduct.Price />
          </div>
        </SingleProduct>
      );
    });
  }, [products]);
  return (
    <div className='col-span-1 xl:col-span-3 xl:order-1 order-2 flex flex-col items-center gap-16'>
      <div className='w-full flex flex-wrap justify-between gap-x-4 gap-y-16'>
        {renderedProducts}
      </div>
      {Number(total_pages) > 1 && (
        <div className='w-full'>
          <CustomPagination
            curPage={Number(current_page)}
            totalPage={Number(total_pages)}
          />
        </div>
      )}
    </div>
  );
}

export default ProductsSection;
