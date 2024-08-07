import { Metadata } from 'next';
export const metadata: Metadata = {};
const ProductsDetailsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export default ProductsDetailsLayout;
