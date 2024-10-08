import React, { useMemo } from 'react';
import { SingleProduct } from '@/components/ui/SingleProduct';
import { Product } from '@/types/types';
import CustomPaginationV2 from '@/components/ui/CustomPaginationV2';
import { usePathname, useRouter } from 'next/navigation';
type Props = {
  products: Product[];
  total_pages: string | number;
};
function ProductsSection({ products, total_pages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const renderedProducts = useMemo(() => {
    return products?.map((p: Product) => {
      return (
        <SingleProduct
          articleClass='col-span-1 m-auto w-full max-w-[180px] md:max-w-[250px] flex flex-col gap-2'
          key={p?.id}
          product={p}
        >
          <SingleProduct.Image />
          <div
            className='flex flex-col gap-2 cursor-pointer'
            onClick={() =>
              router.push(
                `/products/${pathname.split('/products')[1].replace('/', '')}/${
                  p.search_url ? p.search_url : p.id
                }`
              )
            }
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
  }, [products, router, pathname]);
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='w-full grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8'>
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
