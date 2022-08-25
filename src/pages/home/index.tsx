import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import svg_metalamp from 'assets/images/metalamp.svg';

import { Image } from 'components/image';

import { WalletButton } from 'containers/wallet-button';

import { useWallet } from 'services/ethereum';

import { ROUTES } from 'shared/constants';

import styles from './module.scss';

export const Home: FC = observer(() => {
  const isConnected = useWallet(({ status }) => status === 'connected');
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) navigate(ROUTES.MINT, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <main className={styles['container']}>
      <div className={styles['layout']}>
        <div className={styles['logo']}>
          <Image src={svg_metalamp} alt="Metalamp logo" timeout={700} />
        </div>

        <div className={styles['content']}>
          <h1 className={styles['title']}>Metalamp NFT project</h1>

          <p className={styles['description']}>
            <span>
              Connect your wallet, verify balance, select the number of NFTs you would like to purchase, and
              click <b>"Mint"</b>.
            </span>

            <span>
              Questions? Issues? Get the <a href="/change/me">mint guide</a>
            </span>
          </p>

          <WalletButton>Connect my wallet</WalletButton>
        </div>
      </div>
    </main>
  );
});
