import { FC } from 'react';

import { FOOTER_NAV } from 'shared/constants';

import styles from './module.scss';

export const Footer: FC = () => {
  return (
    <footer className={styles['container']}>
      <div className={styles['layout']}>
        <nav className={styles['navigation']}>
          <ul>
            {FOOTER_NAV.map(({ href, text }, idx) => (
              <li key={idx}>
                <a href={href}>{text}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};
