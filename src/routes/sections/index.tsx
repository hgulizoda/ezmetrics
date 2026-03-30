import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Default redirect
    { path: '/', element: <Navigate to="/dashboard" replace /> },

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
