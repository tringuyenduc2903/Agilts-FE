import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { scrollToTop } from '../utils/scrollElement';

const useQueryString = (): [
  (name: string | string[], value: string | string[]) => void,
  (name: string) => void,
  () => void
] => {
  const searchQuery = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string | string[], value: string | string[]) => {
      const newQuery = new URLSearchParams(searchQuery.toString());
      if (Array.isArray(name) && Array.isArray(value)) {
        name.forEach((query, index) => {
          newQuery.set(query, value[index]);
        });
      } else {
        if (value) {
          name !== 'page' && newQuery.set('page', '1');
          newQuery.set(name as string, value as string);
        }
      }
      scrollToTop();
      return router.push(`${pathname}?${newQuery.toString()}`, {
        scroll: false,
      });
    },
    [router, searchQuery, pathname, scrollToTop]
  );
  const removeValueQueryString = useCallback(
    (name: string) => {
      const newQuery = new URLSearchParams(searchQuery.toString());
      newQuery.delete(name);
      return router.push(`${pathname}?${newQuery.toString()}`, {
        scroll: false,
      });
    },
    [searchQuery, pathname, router]
  );
  const deleteQueryString = useCallback(() => {
    router.push(pathname + '?' + 'page=1', { scroll: false });
    scrollToTop();
  }, [router, pathname, scrollToTop]);

  return [createQueryString, removeValueQueryString, deleteQueryString];
};

export default useQueryString;
