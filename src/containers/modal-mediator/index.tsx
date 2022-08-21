import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { ModalCoinbase, ModalMetamask, ModalWalletConnect, ModalConnect } from 'containers/modal-wallet';

import { useModal } from 'services/ui';

import { Modals, WalletIDs } from 'shared/constants';

const modals: Record<string, ReactElement> = {
  [Modals.WALLET]: <ModalConnect />,
  [WalletIDs.METAMASK]: <ModalMetamask />,
  [WalletIDs.COINBASE]: <ModalCoinbase />,
  [WalletIDs.WALLET_CONNECT]: <ModalWalletConnect />,
};

export const ModalMediator = observer(() => {
  const { current } = useModal(({ current, clear }) => ({ current, clear }));

  return <>{current && modals[current] && modals[current]}</>;
});
