import React from 'react';
import { FaCheck } from 'react-icons/fa6';
type Props = {
  cb: () => void;
  isCheck: boolean;
};
function CustomCheckbox({ cb, isCheck }: Props) {
  return (
    <button
      aria-label='checkbox'
      onClick={cb}
      className={`size-5 rounded-sm border p-[2px] flex justify-center items-center ${
        isCheck ? 'border-red-500 bg-red-600' : 'border-neutral-700'
      }`}
    >
      {isCheck && <FaCheck className='text-white text-2xl' />}
    </button>
  );
}

export default CustomCheckbox;
