import { FC, useState } from 'react';

import { Button } from 'components/button';
import { LoaderCircle } from 'components/loader-circle';
import { Input } from 'components/input';

import styles from './module.scss';

export const UiKit: FC = () => {
  const [fieldDefault, setFieldDefault] = useState('');
  const [fieldError, setFieldError] = useState('');

  return (
    <div className={styles['container']}>
      <div className={styles['layout']}>
        <Button onClick={() => null}>Button</Button>
        <Button onClick={() => null} icon={<LoaderCircle />}>
          Button
        </Button>

        <Input text="Field default" onChange={setFieldDefault}>
          {fieldDefault}
        </Input>

        <Input text="Field error" theme="error" onChange={setFieldError}>
          {fieldError}
        </Input>
      </div>
    </div>
  );
};
