import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { ModalCoinbase, ModalMetamask, ModalWalletConnect, ModalConnect } from 'containers/modal-wallet';

import { ModalName } from 'store/ui';
import { useModal } from 'store/hooks/useModal';

const modals: Record<ModalName, ReactElement> = {
  [ModalName.WALLET]: <ModalConnect />,
  [ModalName.METAMASK]: <ModalMetamask />,
  [ModalName.COINBASE]: <ModalCoinbase />,
  [ModalName.WALLET_CONNECT]: <ModalWalletConnect />,
};

export const ModalMediator = observer(() => {
  const { current } = useModal((modal) => ({
    current: modal.current,
    clear: modal.clear,
  }));

  return <>{current && modals[current]}</>;
});
