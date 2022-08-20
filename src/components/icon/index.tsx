import { FC, ReactNode } from 'react';
import ReactIconKit from 'react-icons-kit';

export type Props = {
  className?: string;
  children: ReactNode;
};

export const Icon: FC<Props> = ({ className, children }) => (
  <ReactIconKit
    icon={children}
    color="currentColor"
    className={className}
    style={{ display: 'inline-flex' }}
  />
);
