import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

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
const StatisticsDetail = lazy(() => import('src/pages/dashboard/statistics/detail'));

// EZ Metric Pages
const EZMetricDashboard = lazy(() => import('src/pages/dashboard/ez-metric/dashboard'));
const WorkersPage = lazy(() => import('src/pages/dashboard/ez-metric/workers'));
const ClockPage = lazy(() => import('src/pages/dashboard/ez-metric/clock'));
const ClockDetailPage = lazy(() => import('src/pages/dashboard/ez-metric/clock-detail'));
const EfficiencyPage = lazy(() => import('src/pages/dashboard/ez-metric/efficiency'));
const SalaryPage = lazy(() => import('src/pages/dashboard/ez-metric/salary'));
const EZSettingsPage = lazy(() => import('src/pages/dashboard/ez-metric/settings'));

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <DashboardLayout>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      {
        index: true,
        element: <EZMetricDashboard />,
      },
      // EZ Metric routes
      {
        path: 'workers',
        element: <WorkersPage />,
      },
      {
        path: 'clock',
        element: <ClockPage />,
      },
      {
        path: 'clock/:workerId',
        element: <ClockDetailPage />,
      },
      {
        path: 'efficiency',
        element: <EfficiencyPage />,
      },
      {
        path: 'salary',
        element: <SalaryPage />,
      },
      {
        path: 'settings',
        element: <EZSettingsPage />,
      },
      // Legacy routes
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
        path: 'bonus/:id/:name',
      },
      {
        element: <RemovedBonusRoot />,
        path: 'bonus/restore/:id/:name',
      },
      {
        path: 'chat',
        element: <ChatRoot />,
      },
      {
        path: 'statistics',
        element: <Statistics />,
      },
      {
        path: 'statistics/:userId',
        element: <StatisticsDetail />,
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
