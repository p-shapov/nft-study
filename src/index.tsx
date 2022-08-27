import 'the-new-css-reset';
import 'shared/styles/global.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ModalMediator } from 'containers/modal-mediator';
import { SuspendReady } from 'containers/suspend-ready';
import { DevPanel } from 'containers/dev-panel';

import { UIProvider } from 'services/ui';
import { EthereumProvider } from 'services/ethereum';

import { App } from './app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <EthereumProvider>
      <UIProvider>
        <BrowserRouter>
          <SuspendReady>
            <App />
          </SuspendReady>
          <ModalMediator />
          <DevPanel />
        </BrowserRouter>
      </UIProvider>
    </EthereumProvider>
  </React.StrictMode>,
);
