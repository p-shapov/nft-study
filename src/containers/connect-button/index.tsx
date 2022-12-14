import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { Button } from 'components/button';

import { ModalName } from 'store/ui';
import { useModal } from 'store/hooks/useModal';

export type Props = {
  children?: string;
};

export const ConnectButton: FC<Props> = observer((props) => {
  const pushModal = useModal((modal) => modal.push);

  const handleClick = () => pushModal(ModalName.WALLET);

  return (
    <Button onClick={handleClick} shrink>
      {props.children || 'Connect wallet'}
    </Button>
  );
});
