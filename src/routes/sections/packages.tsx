import { lazy } from 'react';

import { ApplicantsLayout } from 'src/layouts/packages/applicants';

import { PackageTruckDetails } from '../../layouts/packages/truckDetails';

const AllPackages = lazy(() => import('src/pages/dashboard/packages/all'));
const ChinaWarehouse = lazy(() => import('src/pages/dashboard/packages/chinaWarehouse'));
const ChinaBorder = lazy(() => import('src/pages/dashboard/packages/chinaBorder'));
const TranzitZone = lazy(() => import('src/pages/dashboard/packages/transit'));
const TruckDetails = lazy(() => import('src/pages/dashboard/trucks/truckDetails'));
const UZBTables = lazy(() => import('src/pages/dashboard/packages/uzb'));
const CustomsTable = lazy(() => import('src/pages/dashboard/packages/customs'));
const Deliverd = lazy(() => import('src/pages/dashboard/packages/delivered'));
// ----------------------------------------------------------------------

export const packagesRoutes = [
  {
    path: 'all',
    element: <ApplicantsLayout />,
    children: [
      { element: <AllPackages />, index: true },
      { element: <ChinaWarehouse />, path: 'china-warehouse' },
      { element: <ChinaBorder />, path: 'china-border' },
      { element: <TranzitZone />, path: 'tranzit-zone' },
      { element: <UZBTables />, path: 'uzb-customs' },
      { element: <CustomsTable />, path: 'customs' },
      { element: <Deliverd />, path: 'delivered' },
    ],
  },
  {
    path: 'all',
    element: <PackageTruckDetails />,
    children: [
      {
        path: 'china-border/truck/:id',
        element: <TruckDetails />,
      },
      {
        path: 'tranzit-zone/truck/:id',
        element: <TruckDetails />,
      },
      {
        path: 'uzb-customs/truck/:id',
        element: <TruckDetails />,
      },
      {
        path: 'customs/truck/:id',
        element: <TruckDetails />,
      },
      {
        path: 'delivered/truck/:id',
        element: <TruckDetails />,
      },
    ],
  },
];
