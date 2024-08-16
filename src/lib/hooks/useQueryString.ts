import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { scrollToTop } from '../utils/scrollElement';
const useQueryString = (): [
  (
    name: string | string[],
    value: string | string[],
    isBoolean?: boolean
  ) => void,
  (name: string) => void,
  (isBoolean?: boolean) => void
] => {
  const searchQuery = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string | string[], value: string | string[], isBoolean = true) => {
      const newQuery = new URLSearchParams(searchQuery.toString());
      if (Array.isArray(name) && Array.isArray(value)) {
        newQuery.set('page', '1');
        value.forEach((value, index) => {
          if (value[index]) {
            newQuery.set(name[index], value);
          } else {
            newQuery.delete(name[index]);
          }
        });
      } else {
        if (!['null', null, undefined, 'undefined'].includes(value as string)) {
          if (['review', 'latest', 'oldest'].includes(value as string)) {
            newQuery.delete('sortDirection');
          }
          name !== 'page' && newQuery.set('page', '1');
          newQuery.set(name as string, value as string);
        }
      }
      isBoolean && scrollToTop();
      return router.push(`${pathname}?${newQuery.toString()}`, {
        scroll: false,
      });
    },
    [router, searchQuery, pathname]
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
  const deleteQueryString = useCallback(
    (isBoolean = true) => {
      router.push(pathname, { scroll: false });
      isBoolean && scrollToTop();
    },
    [router, pathname]
  );

  return [createQueryString, removeValueQueryString, deleteQueryString];
};

export default useQueryString;
