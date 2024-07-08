'use client';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('error');

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-800 flex flex-col justify-center items-center gap-4'>
      <h2 className='text-2xl md:text-4xl font-bold'>{t('message')}</h2>
      <button
        className='bg-neutral-800 text-white px-4 py-2 rounded-sm'
        onClick={reset}
      >
        {t('btn')}
      </button>
    </div>
  );
}
