import { FC } from 'react';

import { ico_loader_line } from 'assets/icons/loader-line';

import styles from './module.scss';

export const LoaderLine: FC = () => <div className={styles['loader-line']}>{ico_loader_line}</div>;
