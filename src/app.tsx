import { Route, Routes } from 'react-router';

import { Home } from './pages/home';
import { UiKit } from './pages/ui-kit';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {process.env.NODE_ENV === 'development' && <Route path="/ui-kit" element={<UiKit />} />}
    </Routes>
  );
};
