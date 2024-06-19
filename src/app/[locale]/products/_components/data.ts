import testImg1 from '@/assets/test1.jpg';
import { Product } from '@/components/ui/SingleProduct';

export const productsData: Product[] = [
  {
    category: 'Fast - helmets',
    title: 'Exhaust',
    price: '80.00đ',
    salePrice: '80.00đ',
    img: testImg1 as any,
  },
  {
    category: 'helmets - quantity',
    title: 'Brakes',
    price: '200.00đ',
    salePrice: '100.00đ',
    img: testImg1 as any,
  },
  {
    category: 'Fast - helmets',
    title: 'Helmets',
    salePrice: null,
    price: '380.00đ',
    img: testImg1 as any,
  },
  {
    category: 'helmets',
    title: 'Filter',
    salePrice: '80.00đ',
    price: '30.00đ',
    img: testImg1 as any,
  },
  {
    category: 'Fast - helmets',
    title: 'Gloves',
    salePrice: null,
    price: '480.00đ',
    img: testImg1 as any,
  },
  {
    category: 'leather',
    title: 'Boots',
    salePrice: '80.00đ',
    price: '210.00đ',
    img: testImg1 as any,
  },
];
export type Category = {
  title: string;
  value: number | string;
};
export type Tag = {
  title: string;
  slug: string;
};
export const categoriesData: Category[] = [
  {
    title: 'Fast',
    value: 1,
  },
  {
    title: 'Helmets',
    value: 2,
  },
  {
    title: 'Leather',
    value: 3,
  },
  {
    title: 'Moto',
    value: 4,
  },
  {
    title: 'Quality',
    value: 5,
  },
  {
    title: 'Speed',
    value: 6,
  },
  {
    title: 'Balance',
    value: 7,
  },
  {
    title: 'Sound',
    value: 8,
  },
];

export const tagsData: Tag[] = [
  {
    title: 'Apps',
    slug: 'apps',
  },
  {
    title: 'Fast',
    slug: 'fast',
  },
  {
    title: 'Future',
    slug: 'future',
  },

  {
    title: 'Modern art',
    slug: 'modern-art',
  },
  {
    title: 'Moto',
    slug: 'moto',
  },
  {
    title: 'Ride',
    slug: 'ride',
  },
  {
    title: 'Sport',
    slug: 'sport',
  },
  {
    title: 'Track',
    slug: 'track',
  },
];
