import React, { InputHTMLAttributes, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
type Props = {
  disabled: boolean;
} & InputHTMLAttributes<HTMLInputElement>;
function CustomInputPassword({ disabled, ...rest }: Props) {
  const [isShowPwd, setIsShowPwd] = useState(false);
  return (
    <div className='relative w-full'>
      <input
        className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
        type={isShowPwd ? 'text' : 'password'}
        disabled={disabled}
        {...rest}
      />
      <button
        type='button'
        className='absolute top-1/2 -translate-y-1/2 right-2'
        aria-label='toggle-pwd-btn'
        onClick={() => setIsShowPwd(!isShowPwd)}
        disabled={disabled}
      >
        {isShowPwd ? (
          <FaRegEye className='text-xl' />
        ) : (
          <FaRegEyeSlash className='text-xl' />
        )}
      </button>
    </div>
  );
}

export default CustomInputPassword;
