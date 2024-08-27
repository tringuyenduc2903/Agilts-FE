import React from 'react';
type Props = {
  cb: () => void;
  isCheck: boolean;
};
function CustomRadio({ cb, isCheck }: Props) {
  return (
    <button
      aria-label='checkbox'
      onClick={cb}
      className={`size-4 rounded-full border p-[2px] flex justify-center items-center ${
        isCheck ? 'border-red-500 bg-red-600' : 'border-neutral-700'
      }`}
    >
      {isCheck && <span className='size-2 bg-white rounded-full'></span>}
    </button>
  );
}

export default CustomRadio;
