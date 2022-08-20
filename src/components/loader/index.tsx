import { FC } from 'react';
import { loader } from 'react-icons-kit/feather/loader';

import { Icon } from 'components/icon';

import styles from './module.scss';

export const Loader: FC = () => <Icon className={styles['icon']}>{loader}</Icon>;
