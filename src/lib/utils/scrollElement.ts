import { RefObject } from 'react';

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToElement = (elementRef: RefObject<HTMLElement>) => {
  elementRef.current?.scrollIntoView();
};
