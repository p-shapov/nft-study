import { observer } from 'mobx-react-lite';
import { FC, ReactNode } from 'react';

import { useWallet } from 'services/ethereum';

import styles from './module.scss';

export type Props = {
  children: ReactNode;
};

export const SuspendReady: FC<Props> = observer(({ children }) => {
  const isReady = useWallet(({ isReady }) => isReady);

  return <>{isReady && <div className={styles['suspend-ready']}>{children}</div>}</>;
});
