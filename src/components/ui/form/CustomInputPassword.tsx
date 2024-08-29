import React, { InputHTMLAttributes, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
type Props = {
  disabled: boolean;
  error?: any;
  form_name?: string;
  reacthooksform?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;
function CustomInputPassword({
  form_name,
  disabled,
  reacthooksform = true,
  error,
  ...rest
}: Props) {
  const [isShowPwd, setIsShowPwd] = useState(false);
  const { register } = useFormContext();
  return (
    <div className='w-full flex flex-col gap-2'>
      <div className='relative w-full'>
        {reacthooksform ? (
          <input
            className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
            type={isShowPwd ? 'text' : 'password'}
            disabled={disabled}
            {...register(form_name ? form_name : 'password')}
            {...rest}
          />
        ) : (
          <input
            className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
            type={isShowPwd ? 'text' : 'password'}
            disabled={disabled}
            {...rest}
          />
        )}
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
      {error && (
        <p className='text-red-500 font-bold text-sm md:text-base'>{error}</p>
      )}
    </div>
  );
}

export default CustomInputPassword;
