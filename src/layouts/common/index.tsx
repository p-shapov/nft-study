import { FC, ReactNode } from 'react';

import { Footer } from './footer';
import { Header } from './header';
import styles from './module.scss';

export type Props = {
  children: ReactNode;
};

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className={styles['content']}>
      <Header />

      <main>{children}</main>

      <Footer />
    </div>
  );
};
