import { useEffect, MutableRefObject } from 'react';

export function useOnClickOutside<T>(
  ref: MutableRefObject<T> | null,
  handler: (args: {
    isClickedOutside: boolean;
    event?: MouseEvent | TouchEvent;
  }) => void
) {
  useEffect(() => {
    const clickHandler = (event: MouseEvent | TouchEvent) => {
      if (!ref || !ref.current) {
        return;
      }
      const isClickedOutside = !(
        ref.current as unknown as HTMLElement
      ).contains(event.target as Node);

      handler && handler({ isClickedOutside, event });
    };

    document.addEventListener('click', clickHandler);
    document.addEventListener('touchstart', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('touchstart', clickHandler);
    };
  }, [ref, handler]);
}
