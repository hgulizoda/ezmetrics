import { lazy } from 'react';

import { ArchiveLayout } from '../../layouts/archive';

const Transports = lazy(() => import('src/pages/dashboard/archive/transport'));
const Users = lazy(() => import('src/pages/dashboard/archive/users'));
const Packages = lazy(() => import('src/pages/dashboard/archive/packages'));
const ArchivedTruckDetails = lazy(
  () => import('src/modules/archive/ui/transport/details/ArchivedTruckDetails')
);
const ArchivedChatsRoot = lazy(() => import('src/pages/dashboard/archive/chats'));
export const archiveRoutes = [
  {
    path: 'archive',
    element: <ArchiveLayout />,
    children: [
      {
        path: 'packages',
        element: <Packages />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'transports',
        element: <Transports />,
      },
      {
        path: 'transports/:id',
        element: <ArchivedTruckDetails />,
      },
      {
        path: 'chats',
        element: <ArchivedChatsRoot />,
      },
    ],
  },
];
