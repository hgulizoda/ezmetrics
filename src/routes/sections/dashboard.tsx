import { lazy, Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';
// ----------------------------------------------------------------------
import AddPackageFormPage from 'src/pages/dashboard/packages/addpackage';

import { LoadingScreen } from 'src/components/loading-screen';

import { usersRoutes } from './users';
import { pricesRoutes } from './auto';
import { archiveRoutes } from './archive';
import { packagesRoutes } from './packages';
import { settingsRoutes } from './settings';
import { feedbacksRoutes } from './feedbacks';
import ChatRoot from '../../pages/dashboard/chat';

const BannerRoot = lazy(() => import('src/pages/dashboard/settings/Banner'));
const StoreRoot = lazy(() => import('src/pages/dashboard/store'));
const NotificationTable = lazy(() => import('src/pages/dashboard/notification/notificationTable'));
const NotificationFormRoot = lazy(
  () => import('src/pages/dashboard/notification/notificationForm')
);
const SingleBonusRoot = lazy(() => import('src/pages/dashboard/bonus/single'));
const RemovedBonusRoot = lazy(() => import('src/pages/dashboard/bonus/removed'));
const BonusPageRoot = lazy(() => import('src/pages/dashboard/bonus'));

const Statistics = lazy(() => import('src/pages/dashboard/statistics'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/all" />,
      },
      {
        path: 'add-package',
        element: <AddPackageFormPage />,
      },
      {
        path: 'update-package/:id',
        element: <AddPackageFormPage />,
      },
      {
        path: 'banner',
        element: <BannerRoot />,
      },
      {
        path: 'store',
        element: <StoreRoot />,
      },
      {
        element: <NotificationTable />,
        path: 'notifications',
      },
      {
        element: <NotificationFormRoot />,
        path: 'notifications/:id',
      },
      {
        element: <NotificationFormRoot />,
        path: 'notifications/send',
      },
      {
        element: <BonusPageRoot />,
        path: 'bonus',
      },
      {
        element: <SingleBonusRoot />,
        path: 'bonus/:id',
      },
      {
        element: <RemovedBonusRoot />,
        path: 'bonus/restore/:id',
      },
      {
        path: 'chat',
        element: <ChatRoot />,
      },
      {
        path: 'statistics',
        element: <Statistics />,
      },
      ...packagesRoutes,
      ...usersRoutes,
      ...settingsRoutes,
      ...archiveRoutes,
      ...pricesRoutes,
      ...feedbacksRoutes,
    ],
  },
];
