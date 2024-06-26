import { useTranslations } from 'next-intl';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';
function Address() {
  const t = useTranslations('common');
  return (
    <div className='flex flex-col gap-6'>
      <div className='pb-4 flex justify-between items-center border-b border-neutral-300'>
        <h1 className='text-xl md:text-2xl py-2 font-bold'>{t('address')}</h1>
        <button className='px-4 py-2 sm:py-3 rounded-sm w-max h-max flex justify-center items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-sm md:text-base text-white'>
          <FaPlus />
          <p>{t('add_address')}</p>
        </button>
      </div>
      <div></div>
    </div>
  );
}

export default Address;
