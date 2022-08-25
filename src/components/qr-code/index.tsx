import { FC, ReactNode } from 'react';
import { QRCode as QRCodeLogo } from 'react-qrcode-logo';

import styles from './module.scss';

export type Props = {
  value?: string;
  logo?: ReactNode;
};

export const QRCode: FC<Props> = ({ value, logo }) => (
  <div className={styles['qrcode']}>
    <div className={styles['layout']}>
      <QRCodeLogo
        value={value}
        size={500}
        qrStyle="dots"
        ecLevel="H"
        logoImage="/"
        eyeRadius={5}
        bgColor="transparent"
        removeQrCodeBehindLogo
      />
      {logo && <div className={styles['logo']}>{logo}</div>}
    </div>
  </div>
);
