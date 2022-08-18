import { Route, Routes } from 'react-router';

import { Home } from './pages/home';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
