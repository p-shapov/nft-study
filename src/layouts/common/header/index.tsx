import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import cn from 'classnames';
import { computed } from 'mobx';

import links from 'assets/data/header-links.json';

import { DisconnectButton } from 'containers/disconnect-button';

import { useWallet } from 'services/ethereum';

import styles from './module.scss';

export const Header: FC = observer(() => {
  const isConnected = useWallet((wallet) => computed(() => wallet.status === 'connected').get());

  return (
    <header className={styles['header']}>
      <div className={styles['layout']}>
        <div className={cn(styles['wallet'], isConnected && styles['wallet--shown'])}>
          <DisconnectButton />
        </div>

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
    </header>
  );
});
