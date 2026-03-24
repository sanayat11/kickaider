import { useEffect, type RefObject } from 'react';

type UseOutsideClickParams<T extends HTMLElement> = {
  ref: RefObject<T | null>; 
  handler: () => void;
  enabled?: boolean;
};

export const useOutsideClick = <T extends HTMLElement>({
  ref,
  handler,
  enabled = true,
}: UseOutsideClickParams<T>) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      const target = event.target as Node | null;

      if (!element || !target) return;
      if (element.contains(target)) return;

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
};