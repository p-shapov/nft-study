import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import { FC, useState } from 'react';
import ReactJSON from 'react-json-view';

import { useStore } from 'store/hooks/useStore';

import styles from './module.scss';

export const DevPanel: FC = observer(() => {
  const [expanded, setExpanded] = useState(false);

  const { wallet, modal } = useStore();

  const handleTogglePanel = () => setExpanded((x) => !x);

  return (
    <>
      <button className={styles['dev-button']} onClick={handleTogglePanel}>
        Toggle dev panel
      </button>

      <div className={cn(styles['dev-panel'], expanded && styles['dev-panel--expanded'])}>
        <div className={styles['layout']}>
          <ReactJSON
            src={{
              store: {
                wallet: {
                  isReady: wallet.isReady,
                  account: wallet.account,
                  status: wallet.status,
                  chain: wallet.chain,
                  error: wallet.error,
                },
                modal: {
                  current: modal.current,
                  stack: modal.stack,
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
});
