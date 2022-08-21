import { FC } from 'react';
import { QRCode as QRCodeLogo } from 'react-qrcode-logo';

import styles from './module.scss';

export type Props = {
  value: string;
  src?: string;
};

export const QRCode: FC<Props> = ({ value, src }) => (
  <div className={styles['wrapper']}>
    <div className={styles['code']}>
      <QRCodeLogo
        value={value}
        logoImage={src}
        size={500}
        qrStyle="dots"
        eyeRadius={5}
        removeQrCodeBehindLogo
      />
    </div>
  </div>
);
