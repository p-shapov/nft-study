import { useLayoutEffect, useRef, useState } from 'react';

export const useDimensions = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (ref) {
      const { current } = ref;

      if (current) {
        setWidth(current.offsetWidth);
        setHeight(current.offsetHeight);
      }
    }
  }, []);

  return [ref, width, height] as const;
};
