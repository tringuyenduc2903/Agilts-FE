import { TbLoader3 } from 'react-icons/tb';
function Loading() {
  return (
    <div className='fixed w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] bg-white flex justify-center items-center'>
      <div className='animate-spin'>
        <TbLoader3 className='text-red-500 text-6xl' />
      </div>
    </div>
  );
}

export default Loading;
