import { useNavigate } from 'react-router';

export enum Path {
  HOME = '/',
  MINT = '/mint',
}

function useGoTo(replace?: boolean): (route: Path) => void;
function useGoTo(replace: boolean, route: Path): () => void;
function useGoTo(replace = false, route?: Path) {
  const navigate = useNavigate();

  if (route) return () => navigate(route, { replace });

  return (route: Path) => navigate(route, { replace });
}

export { useGoTo };
