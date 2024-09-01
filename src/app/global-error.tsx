'use client'; // Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='vi'>
      <body className='w-full min-h-screen flex flex-col justify-center items-center gap-4'>
        <h2 className='text-4xl font-bold tracking-widest uppercase'>
          Đã xảy ra lỗi !
        </h2>
        <button
          className='px-8 py-2 rounded-sm bg-neutral-800 text-white font-bold'
          onClick={() => reset()}
        >
          Thử lại
        </button>
      </body>
    </html>
  );
}
