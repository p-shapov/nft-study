// TODO :: Add lazy loading

import cn from 'classnames';
import { FC, useState } from 'react';

import styles from './module.scss';

export type Props = {
  src: string;
  alt?: string;
  lazy?: boolean;
  timeout?: number;
};

export const Image: FC<Props> = ({ src, alt, timeout, lazy }) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    if (timeout) setTimeout(() => setLoaded(true), timeout);
    else setLoaded(true);
  };

  return (
    <img
      className={cn(styles['image'], loaded && styles['image--loaded'])}
      src={src}
      alt={alt}
      onLoad={handleLoad}
    />
  );
};
