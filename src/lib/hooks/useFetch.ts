import { useCallback, useState } from 'react';

export const useFetch = (cb: () => Promise<{ type: string; data: any }>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const fetchData = useCallback(async () => {
    setIsSuccess(false);
    setError(null);
    setIsError(false);
    try {
      setIsLoading(true);
      const res = await cb();
      if (res.type === 'success') {
        setData(res.data);
        setIsSuccess(true);
        setError(null);
        setIsError(false);
      }

      if (res.type === 'error') {
        setError(res.data);
        setIsError(true);
        setData(false);
        setIsSuccess(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [cb]);
  const refetchData = useCallback(async () => {
    setIsSuccess(false);
    setError(null);
    setIsError(false);
    const res = await cb();
    if (res.type === 'success') {
      setData(res.data);
      setIsSuccess(true);
      setError(null);
      setIsError(false);
    }

    if (res.type === 'error') {
      setError(res.data);
      setIsError(true);
      setData(false);
      setIsSuccess(false);
    }
  }, [cb]);
  return {
    fetchData,
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch: refetchData,
  };
};
