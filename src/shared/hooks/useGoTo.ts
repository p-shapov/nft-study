import { useNavigate } from 'react-router';

import { ROUTES } from 'shared/constants';
import { ValueOf } from 'shared/types';

type Route = ValueOf<typeof ROUTES>;

function useGoTo(replace?: boolean): (route: Route) => void;
function useGoTo(replace: boolean, route: Route): () => void;
function useGoTo(replace = false, route?: Route) {
  const navigate = useNavigate();

  if (route) return () => navigate(route, { replace });

  return (route: Route) => navigate(route, { replace });
}

export { useGoTo };
