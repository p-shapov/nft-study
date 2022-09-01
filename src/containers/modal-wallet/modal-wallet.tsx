import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';
import cn from 'classnames';
import { computed } from 'mobx';

import { ico_chevron_left } from 'assets/icons/chevron-left';
import { ico_cross_circle } from 'assets/icons/cross-circle';

import { Modal } from 'components/modal';
import { IconButton } from 'components/icon-button';

import { useModal } from 'store/hooks/useModal';
import { useWallet } from 'store/hooks/useWallet';

import styles from './module.scss';

export type Props = {
  title: string;
  children: ReactNode;
  isRoot?: boolean;
};

export const ModalWallet: FC<Props> = observer(({ isRoot, title, children }) => {
  const { isConnected, cancelConnection } = useWallet((wallet) => ({
    cancelConnection: () => wallet.storeConnection(null),
    isConnected: computed(() => wallet.status === 'connected').get(),
  }));
  const { pop: popModal, clear: closeAllModals } = useModal((modal) => ({
    pop: modal.pop,
    clear: modal.clear,
  }));

  useEffect(() => {
    if (isConnected) closeAllModals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handleBack = () => {
    popModal();
    cancelConnection();
  };

  const handleClose = () => {
    closeAllModals();
    cancelConnection();
  };

  return (
    <Modal className={cn(styles['modal-wallet'], isRoot && styles['modal-wallet--is_root'])}>
      <div className={styles['layout']}>
        <div className={styles['header']}>
          <div className={styles['back']}>
            <IconButton onClick={handleBack}>{ico_chevron_left}</IconButton>
          </div>
          <span className={styles['title']}>{title}</span>

          <IconButton onClick={handleClose}>{ico_cross_circle}</IconButton>
        </div>

        {children}
      </div>
    </Modal>
  );
});
