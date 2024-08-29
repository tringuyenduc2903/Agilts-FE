import React, { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  disabled: boolean;
  error?: any;
  form_name: string;
  reacthooksform?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

function CustomInputText({
  form_name,
  disabled,
  reacthooksform = true,
  error,
  ...rest
}: Props) {
  const { register } = useFormContext();

  return (
    <div className='w-full flex flex-col gap-2'>
      {reacthooksform ? (
        <input
          disabled={disabled}
          className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
          {...register(form_name)}
          {...rest}
        />
      ) : (
        <input
          disabled={disabled}
          className='w-full h-full px-4 py-3 md:py-4 border border-neutral-500 rounded-sm text-sm md:text-base'
          {...rest}
        />
      )}
      {error && (
        <p className='text-red-500 font-bold text-sm md:text-base'>{error}</p>
      )}
    </div>
  );
}

export default CustomInputText;
