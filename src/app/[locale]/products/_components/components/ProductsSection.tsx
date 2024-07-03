import React, { useMemo } from 'react';
import { Product, SingleProduct } from '@/components/ui/SingleProduct';
import CustomPagination from '@/components/ui/CustomPagination';
type Props = {
  products: Product[];
  // total_pages: string | number;
  // current_page: string | number;
};
function ProductsSection({ products }: Props) {
  const renderedProducts = useMemo(() => {
    return products?.map((p: Product) => {
      return (
        <SingleProduct
          articleClass='m-auto md:m-0 w-full max-w-[300px] cursor-pointer flex flex-col gap-4'
          key={p.title}
          product={p}
        >
          <SingleProduct.Image />
          <SingleProduct.Category />
          <div className='flex items-center justify-between gap-4 font-bold'>
            <SingleProduct.Title />
            <SingleProduct.Price />
          </div>
        </SingleProduct>
      );
    });
  }, [products]);
  return (
    <div className='col-span-1 xl:col-span-3 xl:order-1 order-2 flex flex-col items-center gap-16'>
      <div className='flex flex-wrap justify-between gap-x-4 gap-y-16'>
        {renderedProducts}
      </div>
      <div className='w-full'>
        <CustomPagination curPage={Number(1)} totalPage={Number(100)} />
      </div>
    </div>
  );
}

export default ProductsSection;
