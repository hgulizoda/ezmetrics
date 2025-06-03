import { Navigate, useRoutes } from 'react-router-dom';

import { useAuthContext } from 'src/auth/hooks';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export default function Router() {
  const { authenticated, unauthenticated } = useAuthContext();
  return useRoutes([
    // Auth routes
    ...(authenticated ? [{ path: '*', element: <Navigate to="/dashboard/all" /> }] : authRoutes),

    // Dashboard routes
    ...(unauthenticated
      ? [{ path: '*', element: <Navigate to="/auth/login" /> }]
      : dashboardRoutes),

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
