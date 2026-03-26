import { Navigate, useRoutes } from 'react-router-dom';

import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Dashboard routes (no auth required)
    ...dashboardRoutes,

    // Default redirect
    { path: '/', element: <Navigate to="/dashboard" replace /> },

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
