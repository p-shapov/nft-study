import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { ModalCoinbase, ModalMetamask, ModalWalletConnect, ModalConnect } from 'containers/modal-wallet';

import { useModal } from 'services/ui';
import { ModalName } from 'services/ui/modal';

import { MODAL_KEY } from 'shared/constants';

const modals: Record<ModalName, ReactElement> = {
  [MODAL_KEY.WALLET]: <ModalConnect />,
  [MODAL_KEY.METAMASK]: <ModalMetamask />,
  [MODAL_KEY.COINBASE]: <ModalCoinbase />,
  [MODAL_KEY.WALLET_CONNECT]: <ModalWalletConnect />,
};

export const ModalMediator = observer(() => {
  const { current } = useModal(({ current, clear }) => ({ current, clear }));

  return <>{current && modals[current]}</>;
});
