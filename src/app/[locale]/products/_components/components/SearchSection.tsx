import useQueryString from '@/lib/hooks/useQueryString';
import { useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';
import { FaSistrix } from 'react-icons/fa6';
function SearchSection() {
  const t = useTranslations('common');
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [createQueryString, removeValueQueryString] = useQueryString();
  const handleKeypress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (searchValue) {
          createQueryString('search', searchValue);
        } else {
          removeValueQueryString('search');
        }
      }
    },
    [createQueryString, removeValueQueryString, searchValue]
  );
  return (
    <div>
      <div
        className={`sm:m-0 w-full md:w-[280px] lg:w-[300px] h-[56px] flex items-stretch uppercase font-bold border ${
          searchFocus ? 'border-red-500' : 'border-neutral-200'
        } transition-colors rounded overflow-hidden`}
      >
        <input
          type='text'
          className='w-full h-full px-4 flex justify-start items-center tracking-[2px] uppercase text-sm'
          placeholder={`${t('your_search')}...`}
          value={searchValue}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeypress}
        />
        <button
          className='h-full px-4 bg-red-500'
          aria-label='search-btn'
          onClick={() => createQueryString('search', searchValue)}
        >
          <FaSistrix className='h-full text-white' />
        </button>
      </div>
    </div>
  );
}

export default SearchSection;
