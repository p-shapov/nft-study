import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useState } from 'react';

import { useWallet } from 'services/ethereum';

import { useTimeout } from 'shared/hooks/useTimeout';

import styles from './module.scss';

export type Props = {
  children: ReactNode;
};

export const ReadyCheck: FC<Props> = observer(({ children }) => {
  const isReady = useWallet(({ isReady }) => isReady);

  const [showApp, setShowApp] = useState(false);

  useTimeout(
    () => {
      if (isReady) setShowApp(true);
    },
    1000,
    [isReady],
  );

  return <>{showApp && <div className={styles['app']}>{children}</div>}</>;
});
