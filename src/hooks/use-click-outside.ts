'use client';

import { useEffect, useRef, type RefObject } from 'react';

interface UseClickOutsideOptions<T extends HTMLElement = HTMLElement> {
  refElement: RefObject<T | null>;
  handler: () => void;
  enabled?: boolean;
}

export function useClickOutside<T extends HTMLElement = HTMLElement>({
  refElement,
  handler,
  enabled = true,
}: UseClickOutsideOptions<T>): void {
  const handlerRef = useRef(handler);

  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        refElement.current !== null &&
        !refElement.current.contains(target)
      ) {
        handlerRef.current();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [enabled]);
}
