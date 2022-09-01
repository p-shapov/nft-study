import 'the-new-css-reset';
import 'shared/styles/global.scss';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

import { SuspendReady } from 'containers/suspend-ready';

import { StoreProvider } from 'store/context';

import { App } from './app';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <SuspendReady>
          <App />
        </SuspendReady>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
);
