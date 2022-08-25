import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useWallet } from 'services/ethereum';

import { ROUTES } from 'shared/constants';

import styles from './module.scss';

export const Mint: FC = () => <Content />;

const Content = observer(() => {
  const isDisconnected = useWallet(({ status }) => status === 'disconnected');
  const navigate = useNavigate();

  useEffect(() => {
    if (isDisconnected) setTimeout(() => navigate(ROUTES.HOME, { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisconnected]);

  return (
    <div className={styles['container']}>
      <div className={styles['layout']}>Minting page</div>
    </div>
  );
});
