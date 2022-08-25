import { Route, Routes } from 'react-router';

import { ROUTES } from 'shared/constants';

import { Home } from './pages/home';
import { Mint } from './pages/mint';
import { UiKit } from './pages/ui-kit';

export const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.MINT} element={<Mint />} />

      {process.env.NODE_ENV === 'development' && <Route path="/ui-kit" element={<UiKit />} />}
    </Routes>
  );
};
