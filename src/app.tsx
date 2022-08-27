import { Route, Routes } from 'react-router';

import { Layout } from 'layouts/common';

import { Home } from 'pages/home';
import { Mint } from 'pages/mint';
import { UiKit } from 'pages/ui-kit';

import { Path } from 'shared/hooks/useGoTo';

export const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path={Path.HOME} element={<Home />} />
        <Route path={Path.MINT} element={<Mint />} />

        {process.env.NODE_ENV === 'development' && <Route path="/ui-kit" element={<UiKit />} />}
      </Routes>
    </Layout>
  );
};
