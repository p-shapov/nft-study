import { FC } from 'react';

import links from 'assets/data/footer-links.json';

import styles from './module.scss';

export const Footer: FC = () => {
  return (
    <footer className={styles['footer']}>
      <div className={styles['layout']}>
        <nav className={styles['navigation']}>
          <ul>
            {links.map(({ href, text }, idx) => (
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
