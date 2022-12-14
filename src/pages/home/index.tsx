import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { computed } from 'mobx';

import svg_metalamp from 'assets/images/metalamp.svg';

import { Image } from 'components/image';

import { ConnectButton } from 'containers/connect-button';

import { Path, useGoTo } from 'shared/hooks/useGoTo';

import { useWallet } from 'store/hooks/useWallet';

import styles from './module.scss';

export const Home: FC = observer(() => {
  const isConnected = useWallet((wallet) => computed(() => wallet.status === 'connected').get());
  const goToMint = useGoTo(true, Path.MINT);

  useEffect(() => {
    if (isConnected) goToMint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return (
    <div className={styles['home']}>
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

          <ConnectButton>Connect my wallet</ConnectButton>
        </div>
      </div>
    </div>
  );
});
