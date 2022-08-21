import { observer } from 'mobx-react-lite';
import { FC, ReactNode, useEffect } from 'react';
import cn from 'classnames';

import { ico_chevron_left } from 'assets/icons/chevron-left';
import { ico_cross_circle } from 'assets/icons/cross-circle';

import { Modal } from 'components/modal';
import { IconButton } from 'components/icon-button';

import { useWallet } from 'services/ethereum';
import { useModal } from 'services/ui';

import styles from './module.scss';

export type Props = {
  title: string;
  children: ReactNode;
  isRoot?: boolean;
};

export const ModalWallet: FC<Props> = observer(({ isRoot, title, children }) => {
  const { isConnected, discard } = useWallet(({ status, discard }) => ({
    isConnected: status === 'connected',
    discard,
  }));
  const { pop: popModal, clear: closeAllModals } = useModal(({ pop, clear }) => ({ pop, clear }));

  useEffect(() => {
    if (isConnected) closeAllModals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const handleBack = () => {
    popModal();
    discard();
  };

  const handleClose = () => {
    closeAllModals();
    if (!isConnected) discard();
  };

  return (
    <Modal className={cn(styles['wrapper'], isRoot && styles['wrapper--is_root'])}>
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
