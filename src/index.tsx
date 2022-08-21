import 'the-new-css-reset';
import 'shared/styles/global.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ModalMediator } from 'containers/modal-mediator';
import { ReadyCheck } from 'containers/ready-check';

import { UIProvider } from 'services/ui';
import { EthereumProvider } from 'services/ethereum';

import { App } from './app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <EthereumProvider>
      <UIProvider>
        <BrowserRouter>
          <ReadyCheck>
            <App />
          </ReadyCheck>
          <ModalMediator />
        </BrowserRouter>
      </UIProvider>
    </EthereumProvider>
  </React.StrictMode>,
);
