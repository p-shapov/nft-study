import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import cn from 'classnames';

import { DisconnectButton } from 'containers/wallet-button';

import { useWallet } from 'services/ethereum';

import { HEADER_NAV } from 'shared/constants';

import styles from './module.scss';

export const Header: FC = observer(() => {
  const isConnected = useWallet(({ status }) => status === 'connected');

  return (
    <header className={styles['container']}>
      <div className={styles['layout']}>
        <div className={cn(styles['wallet'], isConnected && styles['wallet--shown'])}>
          <DisconnectButton />
        </div>

        <nav className={styles['navigation']}>
          <ul>
            {HEADER_NAV.map(({ href, text }, idx) => (
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
