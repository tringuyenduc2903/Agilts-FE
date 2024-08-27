import React from 'react';
import { TbCircleCheckFilled, TbClipboardList } from 'react-icons/tb';
import { FaRegMoneyBillAlt, FaRegCircle } from 'react-icons/fa';
import { AiOutlineGift, AiOutlineTruck } from 'react-icons/ai';
import { MdIncompleteCircle } from 'react-icons/md';
import { TbLoader2 } from 'react-icons/tb';
type Props = {
  step: 1 | 2 | 3 | 4 | 5;
};
function ProgressItem({ step }: Props) {
  return (
    <div className='min-h-[180px] flex justify-between items-center'>
      <div
        className={`relative flex justify-center items-center ${
          step === 1 ? 'text-green-500' : 'text-neutral-700'
        }`}
      >
        <TbClipboardList className='absolute -top-16 left-1/2 -translate-x-1/2 z-10 text-4xl md:text-6xl w-max' />
        <TbCircleCheckFilled className='text-2xl md:text-3xl' />
        <p className='absolute top-12 left-1/2 -translate-x-1/2 z-10 w-max font-bold text-sm sm:text-base md:text-lg'>
          Đặt hàng
        </p>
      </div>
      <span className='flex-1 h-[2px] bg-neutral-600'></span>
      <div
        className={`relative flex justify-center items-center ${
          step === 2
            ? 'text-green-500'
            : [3, 4].includes(step)
            ? 'text-neutral-700'
            : 'text-neutral-300'
        }`}
      >
        <FaRegMoneyBillAlt className='absolute -top-16 left-1/2 -translate-x-1/2 z-10 text-4xl md:text-6xl w-max' />
        {step === 2 && (
          <div className='p-1'>
            <div className='size-6 bg-green-500 rounded-full flex justify-center items-center'>
              <TbLoader2 className='text-white text-xl animate-spin' />
            </div>
          </div>
        )}
        {step !== 2 &&
          ([3, 4, 5].includes(step) ? (
            <TbCircleCheckFilled className='text-2xl md:text-3xl' />
          ) : (
            <FaRegCircle className='text-2xl md:text-3xl' />
          ))}
        <p className='absolute top-12 left-1/2 -translate-x-1/2 z-10 w-max font-bold text-sm sm:text-base md:text-lg'>
          Thanh toán
        </p>
      </div>
      <span className='flex-1 h-[2px] bg-neutral-600'></span>
      <div
        className={`relative flex justify-center items-center ${
          step === 3
            ? 'text-green-500'
            : step === 4
            ? 'text-neutral-700'
            : 'text-neutral-300'
        }`}
      >
        <AiOutlineTruck className='absolute -top-16 left-1/2 -translate-x-1/2 z-10 text-4xl md:text-6xl w-max' />
        {step === 3 && (
          <div className='p-1'>
            <div className='size-6 bg-green-500 rounded-full flex justify-center items-center'>
              <TbLoader2 className='text-white text-xl animate-spin' />
            </div>
          </div>
        )}
        {step !== 3 &&
          (step === 4 ? (
            <TbCircleCheckFilled className='text-2xl md:text-3xl' />
          ) : (
            <FaRegCircle className='text-2xl md:text-3xl' />
          ))}
        <p className='absolute top-12 left-1/2 -translate-x-1/2 z-10 w-max font-bold text-sm sm:text-base md:text-lg'>
          Đã giao cho ĐVVC
        </p>
      </div>
      <span className='flex-1 h-[2px] bg-neutral-600'></span>
      <div
        className={`relative flex justify-center items-center ${
          step === 4
            ? 'text-green-500'
            : step === 5
            ? 'text-neutral-700'
            : 'text-neutral-300'
        }`}
      >
        <AiOutlineGift className='absolute -top-16 left-1/2 -translate-x-1/2 z-10 text-4xl md:text-6xl w-max' />
        {step === 4 && (
          <div className='p-1'>
            <div className='size-6 bg-green-500 rounded-full flex justify-center items-center'>
              <TbLoader2 className='text-white text-xl animate-spin' />
            </div>
          </div>
        )}
        {step !== 4 &&
          (step === 5 ? (
            <TbCircleCheckFilled className='text-2xl md:text-3xl' />
          ) : (
            <FaRegCircle className='text-2xl md:text-3xl' />
          ))}
        <p className='absolute top-12 left-1/2 -translate-x-1/2 z-10 w-max font-bold text-sm sm:text-base md:text-lg'>
          Nhận hàng
        </p>
      </div>
      <span className='flex-1 h-[2px] bg-neutral-600'></span>
      <div
        className={`relative flex justify-center items-center ${
          step === 5 ? 'text-green-500' : 'text-neutral-300'
        }`}
      >
        <MdIncompleteCircle className='absolute -top-16 left-1/2 -translate-x-1/2 z-10 text-4xl md:text-6xl w-max' />
        {step === 5 ? (
          <TbCircleCheckFilled className='text-2xl md:text-3xl' />
        ) : (
          <FaRegCircle className='text-2xl md:text-3xl' />
        )}
        <p className='absolute top-12 left-1/2 -translate-x-1/2 z-10 w-max font-bold text-sm sm:text-base md:text-lg'>
          Hoàn tất
        </p>
      </div>
    </div>
  );
}

export default ProgressItem;
