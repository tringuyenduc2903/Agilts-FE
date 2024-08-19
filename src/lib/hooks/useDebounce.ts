import { useEffect, useState } from 'react';

const useDebounce = (value: any, delay?: number) => {
  const [debounceValue, setDebounceValue] = useState<any>();
  useEffect(() => {
    const timeoutId = setTimeout(
      () => setDebounceValue(value),
      delay ? delay : 500
    );
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);
  return debounceValue;
};

export default useDebounce;
