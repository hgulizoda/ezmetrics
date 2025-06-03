import { lazy } from 'react';

const Auto = lazy(() => import('src/pages/dashboard/auto'));
const SingleAutoPriceRoot = lazy(() => import('src/pages/dashboard/auto/single'));
const AirPrice = lazy(() => import('src/pages/dashboard/auto/air'));
const CreateAutoPrice = lazy(() => import('src/modules/price/ui/action/CreateAutoPrice'));
export const pricesRoutes = [
  {
    path: 'prices',
    children: [
      {
        path: 'auto',
        element: <Auto />,
      },
      {
        path: 'auto/:id',
        element: <SingleAutoPriceRoot />,
      },
      {
        path: 'auto/create',
        element: <CreateAutoPrice />,
      },
      {
        path: 'air',
        element: <AirPrice />,
      },
    ],
  },
];
