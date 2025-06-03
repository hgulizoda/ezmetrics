import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/404'));
const Home = lazy(() => import('src/pages/home'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: <Outlet />,
    children: [
      { path: '404', element: <Page404 /> },
      { path: '/', element: <Home /> },
    ],
  },
];
