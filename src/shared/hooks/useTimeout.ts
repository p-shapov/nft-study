import { useEffect, useRef } from 'react';

export const useTimeout = (cb: () => void, ms: number | null, deps: Array<unknown> = []) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (ms !== null) timeoutRef.current = setTimeout(cb, ms);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, ...deps]);
};
