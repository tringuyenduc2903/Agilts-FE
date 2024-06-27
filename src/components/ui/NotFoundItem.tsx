import React from 'react';

function NotFoundItem({ message }: { message: string }) {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <p className='text-lg md:text-xl font-bold'>{message}</p>
    </div>
  );
}

export default NotFoundItem;
