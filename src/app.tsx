import { Route, Routes } from 'react-router';
import { FC, useEffect, useState } from 'react';

import { ModalMediator } from 'containers/modal-mediator';

import { Layout } from 'layouts/common';

import { Home } from 'pages/home';
import { Mint } from 'pages/mint';
import { UiKit } from 'pages/ui-kit';

import { Path } from 'shared/hooks/useGoTo';

export const App = () => {
  const devPanel = useDevPanel();

  return (
    <>
      <Layout>
        <Routes>
          <Route path={Path.HOME} element={<Home />} />
          <Route path={Path.MINT} element={<Mint />} />

          {process.env.NODE_ENV === 'development' && <Route path="/ui-kit" element={<UiKit />} />}
        </Routes>
      </Layout>
      <ModalMediator />
      {devPanel}
    </>
  );
};

export const useDevPanel = () => {
  const [DevPanel, setDevPanel] = useState<FC | null>(null);

  useEffect(() => {
    const loadDevPanel = async () => {
      if (process.env.NODE_ENV === 'development') {
        return (await import('containers/dev-panel')).DevPanel;
      }

      return null;
    };

    loadDevPanel().then(setDevPanel);
  }, []);

  return DevPanel && <DevPanel />;
};
