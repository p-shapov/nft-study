// TODO :: Add lazy loading

import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import styles from './module.scss';

export type Props = {
  src: string;
  alt?: string;
  lazy?: boolean;
  timeout?: number;
};

export const Image: FC<Props> = ({ src, alt, timeout, lazy }) => {
  const [loaded, setLoaded] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
    skip: !lazy,
  });

  useEffect(() => {
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
    };
  }, []);

  const handleLoad = () => {
    if (timeout) timeoutId.current = setTimeout(() => setLoaded(true), timeout);
    else setLoaded(true);
  };

  return (
    <img
      ref={ref}
      className={cn(styles['image'], loaded && styles['image--loaded'])}
      src={inView || !lazy ? src : undefined}
      alt={alt}
      onLoad={handleLoad}
    />
  );
};
