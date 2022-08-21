import { FC } from 'react';

import { ico_loader_circle } from 'assets/icons/loader-circle';

import styles from './module.scss';

export const LoaderCircle: FC = () => <div className={styles['icon']}>{ico_loader_circle}</div>;
