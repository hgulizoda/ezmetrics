import { lazy } from 'react';

const TruckDetailsRoot = lazy(() => import('../../pages/dashboard/settings/truckDetails'));
const TrucksTableRoot = lazy(() => import('src/pages/dashboard/settings/trucks'));
export const settingsRoutes = [
  {
    path: 'settings',
    children: [
      {
        element: <TrucksTableRoot />,
        path: 'trucks',
      },
      {
        element: <TruckDetailsRoot />,
        path: 'trucks/:id',
      },
      {
        element: 'notification',
        path: 'notifications',
      },
    ],
  },
];
