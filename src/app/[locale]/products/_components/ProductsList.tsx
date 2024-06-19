'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { categoriesData, productsData, tagsData } from './data';
import SortSection from './components/SortSection';
import SearchSection from './components/SearchSection';
import FilterPriceSection from './components/FilterPriceSection';
import ProductsSection from './components/ProductsSection';
import CategoriesSection from './components/CategoriesSection';
import TagsSection from './components/TagsSection';
function ProductsList() {
  const t = useTranslations('common');
  return (
    <section className='py-16 flex flex-col gap-16'>
      <div className='container m-auto px-4 flex flex-col xl:flex-row justify-between gap-4'>
        <h3 className='text-start font-bold tracking-[2px]'>
          {t('showing')} 1–12 {t('of')} 21 {t('results')}
        </h3>
        <div className='flex flex-col md:flex-row xl:items-center xl:justify-center gap-8'>
          <SortSection />
          <SearchSection />
        </div>
      </div>
      <div className='container m-auto px-4 grid grid-cols-1 xl:grid-cols-4 gap-16 overflow-hidden'>
        <ProductsSection products={productsData} />
        <div className='col-span-1 xl:order-2 order-1 flex flex-col gap-8'>
          <FilterPriceSection />
          <CategoriesSection categories={categoriesData} />
          <TagsSection tags={tagsData} />
        </div>
      </div>
    </section>
  );
}

export default ProductsList;
