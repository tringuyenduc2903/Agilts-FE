'user client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/borko-logo-white.png';
import Link from 'next/link';
import { routes } from '../headerData';
import { usePathname, useRouter } from 'next/navigation';
function DefaultHeader() {
  const [isHoverButton, setIsHoverButton] = useState<null | String>(null);
  const [isFocusInput, setIsFocusInput] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <header className='absolute w-full z-50 p-8 flex justify-between items-center gap-8'>
      <button aria-label='btn-back-home' onClick={() => router.push('/')}>
        <Image width={170} height={70} src={logo} alt='logo' />
      </button>
      <div className='flex items-center'>
        {routes?.map((r, index) => {
          const dropdown = r?.dropdown?.map((d) => d.link);
          const dropdownHeight = r?.dropdown?.length * r?.lineHeight + 64;
          return (
            <div className='relative' key={index}>
              <div
                onMouseEnter={() => setIsHoverButton(r?.name)}
                onMouseLeave={() => setIsHoverButton(null)}
              >
                <button
                  className={`relative text-white z-50 px-8 py-4 font-bold uppercase ${
                    pathname === r?.link || dropdown.includes(pathname)
                      ? 'border border-neutral-300'
                      : ''
                  } hover:bg-white hover:text-neutral-800 ${
                    r?.name === isHoverButton && r?.isDropdown
                      ? 'bg-white text-neutral-700'
                      : ''
                  } transition-colors rounded-sm`}
                >
                  <p className='relative py-1'>
                    <span>{r?.name}</span>
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 -bottom-1 ${
                        isHoverButton === r?.name || dropdown.includes(pathname)
                          ? 'w-8'
                          : 'w-0'
                      } h-[2px] bg-red-500 transition-all duration-200`}
                    ></span>
                  </p>
                </button>
                {r?.isDropdown && (
                  <div
                    className={`absolute w-[180px] ${
                      r?.name === isHoverButton
                        ? `h-[${dropdownHeight}px]`
                        : 'h-0'
                    } bg-white flex flex-col justify-start z-50 overflow-hidden transition-all duration-1000`}
                  >
                    <ul className='px-8 py-6 flex flex-col gap-4'>
                      {r?.dropdown?.map((d, index) => {
                        return (
                          <li
                            className='text-neutral-700 font-bold'
                            key={index}
                          >
                            <Link className='uppercase' href={`/${d?.link}`}>
                              {d?.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <span
                className={`fixed top-0 left-0 ${
                  r?.name === isHoverButton && r?.isDropdown
                    ? 'w-full h-full'
                    : 'w-0 h-0'
                }`}
                style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
              ></span>
            </div>
          );
        })}
      </div>
      <div>
        <div className='relative w-[220px]'>
          <input
            className='w-full placeholder:text-white text-white focus:outline-none font-bold bg-transparent uppercase'
            type='text'
            placeholder='SEARCH'
            dir='rtl'
            ref={inputRef}
            onFocus={() => setIsFocusInput(true)}
            onBlur={() => setIsFocusInput(false)}
          />
          <span className='absolute -bottom-2 left-0 w-full h-[2px] bg-neutral-300'></span>
          <span
            className={`absolute -bottom-2 left-0 h-[2px] w-full bg-red-500 z-10 ${
              isFocusInput ? 'opacity-100' : 'opacity-0'
            } transition-all duration-200`}
          ></span>
        </div>
      </div>
    </header>
  );
}

export default DefaultHeader;
