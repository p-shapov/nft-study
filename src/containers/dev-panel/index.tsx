import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import ReactJSON from 'react-json-view';

import { useEthereum } from 'services/ethereum';
import { useUI } from 'services/ui';

import styles from './module.scss';

export const DevPanel: FC = observer(() => {
  const [expanded, setExpanded] = useState(false);

  const { wallet } = useEthereum();
  const { modal } = useUI();

  const handleTogglePanel = () => {
    setExpanded((x) => !x);
  };

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <>
          {' '}
          <button className={styles['dev-button']} onClick={handleTogglePanel}>
            Toggle dev panel
          </button>
          <div className={cn(styles['dev-panel'], expanded && styles['dev-panel--expanded'])}>
            <ReactJSON
              src={{
                ethereum: {
                  wallet: {
                    isReady: wallet.isReady,
                    account: wallet.account,
                    status: wallet.status,
                    chain: wallet.chain,
                    error: wallet.error,
                  },
                },
                ui: {
                  modal: {
                    stack: modal.stack,
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </>
  );
});
